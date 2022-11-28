const validMethods = [
  'get',
  'put',
  'post',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
];

const corsHeaders = {
  'access-control-max-age': '-1',
  'access-control-allow-credentials': 'true',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': '*',
  'access-control-allow-headers': '*',
};

/**
 * Formats OpenAPI contract violations in a more user-friendly format
 * and throws an error for the violation type.
 *
 * @param {String} type request|response
 * @param {Array} violations An array of contract violations
 */
const handleViolations = (type, violations) => {
  if (violations && violations.length > 0) {
    const formattedViolations = violations.reduce((map, v) => {
      const violationName = v.path ? v.path.join('.') : 'general';
      const message = v.code ? `${v.code}: ${v.message}` : v.message;
      map[violationName] = message;
      return map;
    }, {});

    const error = new Error(
      `The ${type} doesn't match the OpenAPI contract \n ${JSON.stringify(
        formattedViolations,
        null,
        2,
      )}`,
    );

    error.violations = formattedViolations;

    throw error;
  }
};

/**
 * Valdates request options and throws some useful errors
 */
const validateOptions = (options) => {
  if (!options.url || options.url.length === 0) {
    throw new Error('URL is missing from mockWithOpenAPI');
  }

  if (
    options.hasOwnProperty('method') &&
    typeof options.method === 'string' &&
    !validMethods.includes(options.method.toLowerCase())
  ) {
    throw new Error(
      `Method '${options.method}' isn't valid, choose a valid HTTP method instead.`,
    );
  }
};

/**
 * Performs a network request using the passed options and validates both the request and response.
 * If any violations were found according to the OpenAPI contract, it throws an error with
 * an object listing the location and reason of the violations.
 *
 * If a network request has been validated, this function returns the actual response.
 *
 * @param {*} options Validation options
 * @param {String} options.url The path of the request e.g. /users
 * @param {String} options.method A valid HTTP method (case-insensitive)
 * @param {String} options.headers HTTP headers
 * @param {String} options.apiPrefix A base url of your API, e.g http://my-api.com (no trailing slash)
 */
const validateWithOpenAPI = (options = {}) => {
  validateOptions(options);

  const openapiPath = Cypress.env('openapiPath');

  return cy
    .task('getOpenAPIResponse', {
      openapiPath,
      ...options,
      validateRequest: true,
    })
    .then((response) => {
      handleViolations('request', response.violations.input);
      handleViolations('response', response.violations.output);
      return response;
    });
};

/**
 * Mocks network requests by providing responses from an OpenAPI file.
 *
 * Usage:
 * cy.mockWithOpenAPI({ url: '/users' });
 *
 * This command uses cy.intercept to hijack any network request that matches
 * the options and return an example response defined in the OpenAPI file. If no exampleKey was
 * passed, it will take the first example.
 *
 * @param {Object} options Mocking options
 * @param {String} options.url The path of the request e.g. /users
 * @param {String} options.method A valid HTTP method (case-insensitive)
 * @param {String} options.apiPrefix A base url of your API, e.g http://my-api.com (no trailing slash)
 * @param {String} options.exampleKey The name of a response example in the OpenAPI file
 *
 */
const mockWithOpenAPI = (options = {}) => {
  validateOptions(options);

  const openapiPath = Cypress.env('openapiPath');
  const apiPrefix = options.hasOwnProperty('apiPrefix')
    ? options.apiPrefix
    : Cypress.env('apiPrefix');

  return cy
    .task('getOpenAPIResponse', { openapiPath, ...options })
    .then((response) => {
      const { data } = response;
      let { url } = options;

      if (apiPrefix && apiPrefix.length > 0) {
        url = apiPrefix + options.url;
      }

      // Always return 200 on OPTIONS until supported by Cypress
      cy.intercept(
        { method: 'OPTIONS', url },
        {
          statusCode: 200,
          headers: corsHeaders,
        },
      );

      return cy.intercept(
        { method: options.method || 'GET', url },
        {
          // Cypress doesn't automatically return CORS headers for intercept calls
          // Wait for https://github.com/cypress-io/cypress/issues/9264 to be officially released
          headers: {
            ...corsHeaders,
            ...response.headers,
          },
          body: data,
          statusCode: response.status,
        },
      );
    });
};

Cypress.Commands.add('mockWithOpenAPI', mockWithOpenAPI);
Cypress.Commands.add('validateWithOpenAPI', validateWithOpenAPI);

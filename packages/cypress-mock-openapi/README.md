## @heetch/cypress-mock-openapi

![Push](https://github.com/heetch/frontend-tools/workflows/Push/badge.svg)

This package contains a Cypress plugin and command to mock and validate responses in tests using an OpenAPI (Swagger) contract.

## Installation

`npm install --dev @heetch/cypress-mock-openapi`

OR

`yarn add --dev @heetch/cypress-mock-openapi`

## Configuration

After installing the package, configure Cypress with the following [environment variables](https://docs.cypress.io/guides/guides/environment-variables.html):

```js
{
  "openapiPath": "test/openapi.yaml",
  "apiPrefix": "http://api-prefix" // Optional
}
```

> The `apiPrefix` can be set globally but also overridden in both commands (or omitted completely).

In your Cypress plugin file:

```js
import getOpenAPIResponse from '@heetch/cypress-mock-openapi/dist/plugin';

module.exports = (on) => {
  on('task', {
    getOpenAPIResponse,
  });
};
```

Either in your support/index.js file or commands.js (for a standard configuration):

```js
import '@heetch/cypress-mock-openapi';
```

## Basic usage

### `cy.mockWithOpenAPI(options)`

This command will:

- Intercept a network request based on the passed options
- Search for the matching operation in the configured OpenAPI file
- Return the response of the operation and method based on the exampleKey

> Note: The first example defined in the OpenAPI contract will be used if none are specified

```yaml
# OpenAPI operation for GET http://my-api.com/users
examples:
  ACTIVE:
    value:
      users:
        - name: Paco
          active: true
```

```js
it('Displays a list of users', () => {
  // Set up the mock for GET http://my-api.com/users
  cy.mockWithOpenAPI({
    apiPrefix: 'http://my-api.com',
    url: '/users',
  }).as('getActiveUsers');

  // When the page loads, fetch /users
  cy.get('html').then(() => fetch('http://my-api.com/users'));

  // Await the results of the interception and make assertions on the mocked response
  cy.wait('@getActiveUsers').then((interception) => {
    expect(interception.response.statusCode).to.eql(200);
    expect(interception.response.body).to.eql({
      users: [{ name: 'Paco', active: true }],
    });
  });
});
```

### `cy.validateWithOpenAPI(options)`

This command can be used to validate that your API returns a response that conforms to the OpenAPI contract (both the request and the response). It will perform the request with the provided options and return the actual response if the validation passes.

If the validation fails, an error will be thrown that contains a list of contract violations. For example:

```js
it('Throws an error if the validation fails', () => {
  cy.validateWithOpenAPI({
    url: '/users',
    headers: {
      Authorization: 'Password',
    }
  });

  // Throws an error with the following information returned:
  {
    message: "The response doesn't match the OpenAPI contract",
    violations: {
      "body.users[0]": "required: should have required property 'age'",
    }
  }
});
```

> Note: This command doesn't intercept requests

## Options reference

## mockWithOpenAPI(options)

| Name       | Type     | Optional | Default     | Example                                                   | Description                                                                       |
| ---------- | -------- | -------- | ----------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| apiPrefix  | `String` | `false`  | `undefined` | `http://my-api.com`                                       | A prefix for API calls. Can also be configured global using Cypress env variables |
| url        | `String` | `false`  | `undefined` | `/users` `/dogs?cute=true`                                | The pathname and query parameters of the request                                  |
| exampleKey | `String` | `true`   | `undefined` | 'OK'                                                      | By default the first example will be used if none are specified                   |
| method     | `String` | `true`   | `'GET'`     | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods | Any supported HTTP method                                                         |

## validateWithOpenAPI(options)

| Name      | Type     | Optional | Default     | Example                                                   | Description                                                                       |
| --------- | -------- | -------- | ----------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| apiPrefix | `String` | `false`  | `undefined` | `http://my-api.com`                                       | A prefix for API calls. Can also be configured global using Cypress env variables |
| url       | `String` | `false`  | `undefined` | `/users` `/dogs?cute=true`                                | The pathname and query parameters of the request                                  |
| method    | `String` | `true`   | `'GET'`     | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods | Any supported HTTP method                                                         |
| headers   | `Object` | `true`   | `{}`        | `{ Authorization: 'Basic 1234' }`                         | The headers required to perform the actual HTTP request                           |

## Developing and testing locally

First, install the package dependencies for this workspace at the root of the repo, then run `yarn install` or `npm install` in this folder.

Files:

- Command: `packages/cypress-mock-openapi/src/index.js`
- Plugin: `packages/cypress-mock-openapi/src/plugin.js`
- Mock server data: `packages/cypress-mock-openapi/test/json/db.json`
- Spec: `packages/cypress-mock-openapi/test/specs/mock.spec.js`

Commands:

```bash
yarn test:open # Opens the Cypress UI
yarn test # Runs the tests in a headless browser
```

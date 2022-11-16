/// <reference types="cypress" />

const getOpenAPIResponse = require('../../src/plugin');
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('task', {
    getOpenAPIResponse,
  });
};

'use strict';

const _ = require('lodash');

/**
 * Sets configuration options for a service
 * @param {object} options - The configuration options to set
 * @param {object} app - The Lando app object
 * @param {string} name - The name of the service
 */
module.exports = (options, app, name) => {
  Object.entries(options).forEach(([key, value]) => {
    _.set(app, `config.services.${name}.${key}`, value);
  });
};

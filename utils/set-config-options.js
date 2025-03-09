'use strict';

/**
 * Sets configuration options for a service
 * @param {object} options - The configuration options to set
 * @param {object} app - The Lando app object
 * @param {string} name - The name of the service
 */
module.exports = (options, app, name) => {
  // Ensure the services and service name paths exist
  if (!app.config) {
    app.config = {};
  }

  if (!app.config.services) {
    app.config.services = {};
  }

  if (!app.config.services[name]) {
    app.config.services[name] = {};
  }

  // Set each option on the service
  Object.entries(options).forEach(([key, value]) => {
    app.config.services[name][key] = value;
  });
};

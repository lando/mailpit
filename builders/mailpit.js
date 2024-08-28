'use strict';
/**
 * Mailpit builder for Lando
 * This module exports a configuration object for the Mailpit service in Lando.
 */

const _ = require('lodash');
const path = require('path');

module.exports = {
  /**
   * Name of the service
   * @type {string}
   */
  name: 'mailpit',

  /**
   * Default configuration for the Mailpit service
   * @type {Object}
   */
  config: {
    version: '1.20',
    supported: ['1.20'],
    relayFrom: [],
    maxMessages: 1000,
    sources: [],
  },

  /**
   * Parent service
   * @type {string}
   */
  parent: '_service',

  /**
   * Builder function for the Mailpit service
   * @param {Object} parent - The parent service class
   * @param {Object} config - The configuration object
   * @returns {Class} LandoMailpit - A class extending the parent service
   */
  builder: (parent, config) => class LandoMailpit extends parent {
    /**
     * Constructor for the LandoMailpit class
     * @param {string} id - The ID of the service
     * @param {Object} options - Configuration options for the service
     */
    constructor(id, options = {}) {
      options = _.merge({}, config, options);

      /**
       * Mailpit service configuration
       * @type {Object}
       */
      const mailpit = {
        image: `axllent/mailpit:v${options.version}`,
        command: '/mailpit',
        environment: {
          TERM: 'xterm',
          MP_UI_BIND_ADDR: '0.0.0.0:80',
          MP_SMTP_AUTH_ACCEPT_ANY: 1,
          MP_SMTP_AUTH_ALLOW_INSECURE: 1,
          MP_MAX_MESSAGES: options.maxMessages,
        },
        ports: ['1025'],
        volumes: [
          `${options.data}:/data`,
        ],
      };

      // Set the user to root
      options.meUser = 'root';

      // Add relayFrom information to options
      options.info = {relayFrom: options.relayFrom};

      // Configure other services to use Mailpit
      options.relayFrom.forEach(service => {
        options.sources.push({
          services: _.set({}, service, {
            environment: {
              MAIL_HOST: options.name,
              MAIL_PORT: options.port,
            }
          })
        });
      });

      // Add the Mailpit service to the sources
      options.sources.push({services: _.set({}, options.name, mailpit)});

      // Call the parent constructor with the processed options
      super(id, options, ..._.flatten(options.sources));
    }
  },
};

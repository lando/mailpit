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
  name: "mailpit",

  /**
   * Default configuration for the Mailpit service
   * @type {Object}
   */
  config: {
    version: "1.20",
    supported: ["1.20"],
    confSrc: path.resolve(__dirname, "..", "config"),
    sendFrom: [],
    maxMessages: 500,
    sources: [],
    port: 1025,
  },

  /**
   * Lando's base Service class
   * @type {string}
   */
  parent: "_service",

  /**
   * Builder function for the Mailpit service
   * @param {Object} parent - The parent service class
   * @param {Object} config - The default configuration object defined above
   * @returns {Class} LandoMailpitService - A class extending Lando's base Service class
   */
  builder: (parent, config) =>
    class LandoMailpitService extends parent {
      /**
       * Constructor for the LandoMailpitService class
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
          command: "/mailpit",
          environment: {
            TERM: "xterm",
            MP_UI_BIND_ADDR: "0.0.0.0:80",
            MP_SMTP_AUTH_ACCEPT_ANY: 1,
            MP_SMTP_AUTH_ALLOW_INSECURE: 1,
            MP_MAX_MESSAGES: options.maxMessages,
            MP_DATABASE: "/data/mailpit.sqlite",
          },
          ports: [`${options.port}`],
          volumes: [`${options.data}:/data`],
          networks: {
            default: {
              aliases: ["sendmailpit"],
            },
          },
        };

        // Set the user to root
        options.meUser = "root";

        // Add senders information to options
        options.info = { sendFrom: options.sendFrom };

        // Configure other services to use Mailpit
        options.sendFrom.forEach((service) => {
          options.sources.push({
            services: _.set({}, service, {
              environment: {
                MAIL_HOST: options.name,
                MAIL_PORT: options.port,
              },
              volumes: [
                `${options.confDest}/mailpit.ini:/usr/local/etc/php/conf.d/zzzz-lando-mailpit.ini`,
              ],
            }),
          });
        });

        // Add the Mailpit service to the sources
        options.sources.push({ services: _.set({}, options.name, mailpit) });

        // Call the parent constructor with the processed options
        super(id, options, ..._.flatten(options.sources));
      }
    },
};

'use strict';

/**
 * @module builders/mailpit
 * @description Mailpit service builder for Lando
 * This module exports a configuration object for the Mailpit service in Lando.
 */

const _ = require('lodash');
const path = require('path');
const addBuildStep = require('../utils/addBuildStep');
const setConfigOptions = require('../utils/setConfigOptions');

/**
 * @typedef {import('@lando/core/lib/services/service')} LandoService
 */

/**
 * @typedef {object} MailpitConfig
 * @property {string} version - Version of Mailpit to use
 * @property {string[]} supported - Supported versions of Mailpit
 * @property {string[]} mailFrom - Services to configure for sending mail to Mailpit
 * @property {number} maxMessages - Maximum number of messages to store before truncating
 * @property {number} port - SMTP port to use for sending mail to Mailpit
 * @property {boolean} ssl - Whether to use SSL for the Mailpit UI
 * @property {boolean} sslExpose - Whether to expose SSL localhost address
 * @property {string} confSrc - Path to configuration sources
 * @property {object[]} sources - Additional service configurations, internally used by Lando
 */

/**
 * @type {MailpitConfig}
 */
const defaultConfig = {
  version: '1.22',
  supported: ['1.22'],
  mailFrom: ['appserver'],
  maxMessages: 500,
  port: 1025,
  ssl: true,
  sslExpose: false,
  scanner: {okCodes: [200]},
  confSrc: path.resolve(__dirname, '..', 'config'),
  sources: [],
};

/**
 * @typedef {object} MailpitService
 * @augments {LandoService}
 * @property {string} name - Name of the service
 * @property {MailpitConfig} config - Default configuration for the Mailpit service
 * @property {string} parent - Lando's base Service class name
 * @property {function(LandoService, MailpitConfig): Function} builder - Builder function for the Mailpit service
 */

/**
 * @type {MailpitService}
 */
module.exports = {
  /**
   * Name of the service
   * @type {string}
   */
  name: 'mailpit',

  /**
   * Default configuration for the Mailpit service
   * @type {MailpitConfig}
   */
  config: defaultConfig,

  /**
   * Lando's base Service class
   * @type {string}
   */
  parent: '_service',

  /**
   * Builder function for the Mailpit service
   * @type {function(LandoService, MailpitConfig): Function}
   * @param {LandoService} parent - The parent service class
   * @param {MailpitConfig} defaultConfig - The default configuration values defined in MailpitService.config
   * @returns {Function} - A constructor function for a class extending Lando's base Service class
   */
  builder: (parent, defaultConfig) =>
    class LandoMailpitService extends parent {
      /**
       * Constructor for the LandoMailpitService class
       * @param {string} id - The ID of the service
       * @param {MailpitConfig} userConfig - The populated configuration options for the service
       */
      constructor(id, userConfig = {}) {
        const debug = userConfig._app.log.debug;

        // Merge the user config onto the default config
        const options = _.merge({}, defaultConfig, userConfig);

        /**
         * Mailpit service configuration
         * @type {object}
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
            MP_DATABASE: '/data/mailpit.sqlite',
          },
          ports: [`${options.port}`],
          volumes: [
            `${options.data}:/data`,
          ],
          networks: {
            default: {
              aliases: ['sendmailpit'],
            },
          },
        };

        // Set the user to root
        options.meUser = 'root';

        // Add senders information to options
        options.info = {mailFrom: options.mailFrom};

        // Set configuration options for the upstream Lando service
        setConfigOptions({
          ssl: options.ssl,
          sslExpose: options.sslExpose,
          scanner: options.scanner,
        }, options._app, options.name);

        // Add build step to copy the `/mailpit` binary to the `/helpers`
        // directory so that it can be used by other services, then set the
        // owner to match the parent directory to avoid permission issues.
        const buildSteps = [
          'cp -f /mailpit /helpers &&' +
          'OWNER=$(stat -c "%u:%g" /helpers) && chown $OWNER /helpers/mailpit',
        ];
        addBuildStep(buildSteps, options._app, options.name, 'build_as_root_internal');

        // Validate and configure services to use Mailpit
        const existingServices = Object.keys(options._app.config.services);
        const validServices = options.mailFrom.filter(service => {
          const exists = existingServices.includes(service);
          if (!exists) {
            debug(`Service "${service}" specified in mailFrom does not exist. Skipping mail configuration.`);
          } else if (service === options.name) {
            debug(`Skipping mail configuration for ${service} as it is the mailpit service itself.`);
          }
          return exists;
        });

        validServices.forEach(service => {
          debug(`Configuring mail settings for ${service}`);
          options.sources.push({
            services: _.set({}, service, {
              environment: {
                MAIL_HOST: options.name,
                MAIL_PORT: options.port,
              },
              volumes: [
                `${options.confDest}/php.ini:/usr/local/etc/php/conf.d/zzzz-lando-mailpit.ini`,
              ],
            }),
          });
        });

        // Add the Mailpit service to the sources
        options.sources.push({services: _.set({}, options.name, mailpit)});

        // Call the parent constructor with the processed options
        super(id, options, ..._.flatten(options.sources));
      }
    },
};

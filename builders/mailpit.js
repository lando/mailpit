'use strict';
const _ = require('lodash');
const path = require('path');

module.exports = {
  name: 'mailpit',
  config: {
    version: '1.20',
    supported: ['1.20'],
    relayFrom: [],
    maxMessages: 1000,
    sources: [],
  },
  parent: '_service',
  builder: (parent, config) => class LandoMailpit extends parent {
    constructor(id, options = {}) {
      options = _.merge({}, config, options);

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

      // Change the me user
      options.meUser = 'root';

      // Add in relayFrom info
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

      // Set the mailpit service
      options.sources.push({services: _.set({}, options.name, mailpit)});

      // Send it downstream
      super(id, options, ..._.flatten(options.sources));
    }
  },
};

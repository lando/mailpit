'use strict';

const path = require('path');

module.exports = {
    name: 'mailpit',
    config: {
        version: 'v1.20',
        supported: ['v1.20'],
        port: '1025',
        webPort: '8025',
        relayFrom: [],
        maxMessages: 500,
    },
    parent: '_service',
    builder: (parent, config) => class LandoMailpit extends parent {
        constructor(id, options = {}) {
            options = {...config, ...options};

            const mailpit = {
                image: `axllent/mailpit:${options.version}`,
                command: '/mailpit',
                environment: {
                    TERM: 'xterm',
                    MP_MAX_MESSAGES: options.maxMessages,
                },
                ports: ['1025', '8025'],
            };

            // Change the me user
            options.meUser = 'root';

            // Add in relayFrom info
            options.info = {relayFrom: options.relayFrom};

            // Configure other services to use Mailpit
            options.relayFrom.forEach(service => {
                options.services = options.services || {};
                options.services[service] = options.services[service] || {};
                options.services[service].environment = options.services[service].environment || {};
                options.services[service].environment.MAIL_HOST = options.name;
                options.services[service].environment.MAIL_PORT = options.port;
            });

            // Set the mailpit service
            options.services = {...options.services, [options.name]: mailpit};

            // Send it downstream
            super(id, options);
        }
    },
};
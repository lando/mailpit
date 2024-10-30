'use strict';

/**
 * Lando Mailpit Task
 * @param {object} lando - The Lando object
 * @returns {object} The task definition
 */
module.exports = lando => {
  return {
    command: 'mailpit',
    describe: 'Shows Mailpit connection information',
    usage: '$0 mailpit',
    examples: [
      '$0 mailpit',
    ],
    run: options => {
      const ux = lando.cli.getUX();

      // Find the mailpit service
      const mailpitService = options._app.info.find(service => service.type === 'mailpit');

      if (!mailpitService) {
        ux.error('No Mailpit service found in this app');
        ux.exit(1);
        return;
      }

      // Get connection details
      const {internal_connection: internal} = mailpitService;

      ux.log('Mailpit Connection Information');
      ux.log('-----------------------------');
      ux.log('SMTP Server Details:');
      ux.log(`Host: ${internal.host}`);
      ux.log(`Port: ${internal.port}`);

      // Show which services are configured to use mailpit
      if (mailpitService.mailFrom && mailpitService.mailFrom.length > 0) {
        ux.log('\nPre-configured Services:');
        mailpitService.mailFrom.forEach(service => {
          ux.log(`- ${service} (configured to use sendmail)`);
        });
        ux.log('\nThese services are already configured to send mail to Mailpit.');
      }

      ux.log('\nEnvironment Variables:');
      ux.log('The following variables are available in all services:');
      ux.log(`MAIL_HOST=${internal.host}`);
      ux.log(`MAIL_PORT=${internal.port}`);
    },
  };
};

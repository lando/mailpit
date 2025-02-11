Basic Mailpit Example
======================

This example demonstrates how to use the Mailpit integration plugin for Lando.

Start up tests
--------------

Run the following commands to get up and running with this example.

```bash
# Should start up successfully
lando poweroff
lando start
```

Verification commands
---------------------

Run the following commands to validate things are rolling as they should.

```bash
# Should have proxy URLs for the Mailpit UI
lando info -s smtpserver --path urls | grep -q http://advanced.lndo.site/mailpit
lando info -s smtpserver --path urls | grep -q https://advanced.lndo.site/mailpit

# Should have root set as the meUser
lando exec smtpserver -- id | tee >(cat 1>&2) | grep -q root

# Should have the correct max messages set
lando exec smtpserver -- env | grep MP_MAX_MESSAGES= | tee >(cat 1>&2) | grep -q MP_MAX_MESSAGES=54321

# Should have SMTP authentication settings
lando exec smtpserver -- env | grep MP_SMTP_AUTH_ACCEPT_ANY= | tee >(cat 1>&2) | grep -q MP_SMTP_AUTH_ACCEPT_ANY=1
lando exec smtpserver -- env | grep MP_SMTP_AUTH_ALLOW_INSECURE= | tee >(cat 1>&2) | grep -q MP_SMTP_AUTH_ALLOW_INSECURE=1

# Should have the correct database file
lando exec smtpserver -- ls -l /data/mailpit.sqlite

# Should be serving the admin interface via http
curl -s http://advanced.lndo.site/mailpit | grep -q Mailpit || echo 'string \`Mailpit\` not found' 1>&2

# Should be serving the admin interface via https
curl -s https://advanced.lndo.site/mailpit | grep -q Mailpit || echo 'string \`Mailpit\` not found' 1>&2

# Should apply mail settings to phpserver
lando exec phpserver -- env | grep MAIL_HOST= | tee >(cat 1>&2) | grep -q MAIL_HOST=smtpserver
lando exec phpserver -- env | grep MAIL_PORT= | tee >(cat 1>&2) | grep -q MAIL_PORT=2025
lando exec phpserver -- cat /usr/local/etc/php/conf.d/zzzz-lando-mailpit.ini | grep -q sendmailpit || echo 'invalid php.ini' 1>&2

# Should have the mailpit binary in the helpers directory
lando exec phpserver -- ls -l /helpers/mailpit

# Should be able to send messages to the SMTP server
lando exec phpserver -- mailpit-test.php

# Should be able to retrieve messages from the SMTP server
lando exec phpserver -- wget sendmailpit/api/v1/messages -qO - | grep -q recipient@example.com
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```

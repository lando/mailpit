Mailpit Example
===============


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
# Should have the correct mail settings for the phpserver
lando ssh -s phpserver -c "env | grep MAIL_HOST=smtpserver"
lando ssh -s phpserver -c "env | grep MAIL_PORT=1025"
lando ssh -s phpserver -c "cat /usr/local/etc/php/conf.d/zzzz-lando-mailpit.ini | grep sendmailpit"

# Should be serving the admin interface on port 80
lando ssh -s phpserver -c "curl -s smtpserver | grep Mailpit || echo 'Mailpit string not found in curl output'"

# Should have root set as the meUser
lando ssh -s smtpserver -c "id | grep root"

# Should be able to collect messages sent from the phpserver
lando ssh -s phpserver -c "php /app/mail.php"
lando ssh -s smtpserver -c "wget localhost/api/v1/messages -qO - | grep recipient@example.com"

# Should have the correct max messages set
lando ssh -s smtpserver -c "env | grep MP_MAX_MESSAGES=500"

# Should have SMTP authentication settings
lando ssh -s smtpserver -c "env | grep MP_SMTP_AUTH_ACCEPT_ANY=1"
lando ssh -s smtpserver -c "env | grep MP_SMTP_AUTH_ALLOW_INSECURE=1"

# Should have the correct database file
lando ssh -s smtpserver -c "ls -l /data/mailpit.sqlite"
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```

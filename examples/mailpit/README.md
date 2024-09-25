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
# Should have the MAIL_HOST and MAIL_PORT set for the phpserver
lando ssh -s phpserver -c "env | grep MAIL_HOST=mailpit"
lando ssh -s phpserver -c "env | grep MAIL_PORT=1025"

# Should be serving the admin interface on port 80
lando ssh -s phpserver -c "curl mailpit | grep Mailpit"

# Should have root set as the meUser
lando ssh -s smtpserver -c "id | grep root"

# Should be able to collect messages sent from the phpserver
lando ssh -s phpserver -c "php /app/mail.php"
lando ssh -s smtpserver -c "curl localhost/api/v1/messages | grep recipient@example.com"

# Should have the correct max messages set
lando ssh -s smtpserver -c "env | grep MP_MAX_MESSAGES=1000"

# Should have SMTP authentication settings
lando ssh -s smtpserver -c "env | grep MP_SMTP_AUTH_ACCEPT_ANY=1"
lando ssh -s smtpserver -c "env | grep MP_SMTP_AUTH_ALLOW_INSECURE=1"
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```

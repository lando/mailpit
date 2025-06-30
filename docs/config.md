---
title: Configuration
description: Learn how to configure the Lando Mailpit service.
---

# Configuration

Here are the configuration options, set to the default values, for this service. If you are unsure about where this goes or what this means we *highly recommend* scanning the [services documentation](https://docs.lando.dev/services/lando-3.html) to get a good handle on how the magicks work.

Also note that options, in addition to the [build steps](https://docs.lando.dev/services/lando-3.html#build-steps) and [overrides](https://docs.lando.dev/services/lando-3.html#overrides) that are available to every service, are shown below:

```yaml
services:
  mailpit:1.27.0
    type: mailpit:1.27.01.27
    mailFrom:
      - appserver
    maxMessages: 500
    port: 1025
```

## Configuration Options

### mailFrom

The `mailFrom` config key lets you specify which services should be configured to send mail through Mailpit. While this configuration is optional, it enables automatic setup of mail sending capabilities in the specified services.

When services are listed under `mailFrom`, Lando will:
1. Install the `mailpit` binary as a [`sendmail` replacement](https://mailpit.axllent.org/docs/install/sendmail/) at `/helpers/mailpit`
2. Configure environment variables (`MAIL_HOST` and `MAIL_PORT`) for SMTP access
3. For PHP services, configure php.ini to use the Mailpit sendmail binary, enabling PHP's built-in `mail()` function to automatically route through Mailpit

If you have an `appserver` service in your application, it will be automatically added to `mailFrom` by default. You can discover available services by running [lando info](https://docs.lando.dev/cli/info.html).

Example configuration with explicit mail service setup:

```yaml
services:
  mailpit:1.27.0
    type: mailpit:1.27.01.27
    mailFrom:
      - phpapp
  phpapp:
    type: php
```

### maxMessages

The maximum number of messages to store before truncating. Must be at least 1.

```yaml
services:
  mailpit:1.27.0
    type: mailpit:1.27.01.27
    maxMessages: 1000  # Store up to 1000 messages
```

### port

The SMTP port to use for sending mail to Mailpit. Must be between 1 and 65535.

```yaml
services:
  mailpit:1.27.0
    type: mailpit:1.27.01.27
    port: 2525  # Use custom SMTP port
```

## Port Forwarding

### portforward

This option is inherited from the `lando` base service. It allows external access to the service by mapping a port on your host's `localhost`. For more details, refer to the [Lando documentation on external access](https://docs.lando.dev/guides/external-access.html).

```yaml
services:
  mailpit:1.27.0
    type: mailpit:1.27.01.27
    portforward: true
```

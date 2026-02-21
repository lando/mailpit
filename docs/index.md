---
title: Mailpit Lando Plugin
description: Add a configurable Mailpit service to Lando for local development with all the power of Docker and Docker Compose.
next: ./config.html
---

# Mailpit Integration for Lando

The official [Mailpit](https://mailpit.axllent.org) integration plugin for [Lando](https://lando.dev). Mailpit is a modern email testing tool for developers that makes it easy to test email sending in your local development environment.

## Features

- A Mailpit service for receiving emails
- Mailpit UI accessible at http and https routes
- Automatic configuration of services to send mail to Mailpit
- Automatic installation of Mailpit sendmail client and configuration into services that need it

## Installation

```bash
lando plugin-add @lando/mailpit
```

## Usage

### 1. Configure your Landofile

Add a mailpit service to your landofile.

```yaml
services:
  mailpit:
    type: mailpit:1.27
    mailFrom: # Defaults to appserver.
      - appserver

# Optionally proxy the Mailpit UI to a custom URL.
proxy:
  mailpit:
    - mailpit.myapp.lndo.site
```

The `mailFrom` option is an array of services that will be configured to send mail to Mailpit. By default, this will be the `appserver` service.

For detailed configuration options, see our [configuration guide](./config.md).

### 2. Send and View Emails

Send mail from your PHP app:

```php
<?php
$to = 'recipient@example.com';
$subject = 'Test email from My App';
$message = 'This is a test email sent via PHP.';
$headers = [
    'From: sender@example.com',
    'Content-Type: text/plain; charset=utf-8'
];

mail($to, $subject, $message, implode("\r\n", $headers));
```

View captured emails in the Mailpit UI at the proxy URL configured above:
- `https://myapp.lndo.site/mailpit`

## Retrieving Information

To retrieve connection and credential details for your Mailpit instance, use the [`lando info`](https://docs.lando.dev/cli/info.html) command.

## Supported versions

- **[1.29.1](https://hub.docker.com/r/axllent/mailpit/)** **(default)**
- [1.27](https://hub.docker.com/r/axllent/mailpit/)
- [1.26](https://hub.docker.com/r/axllent/mailpit/)
- [1.25](https://hub.docker.com/r/axllent/mailpit/)
- [custom](https://docs.lando.dev/services/lando-3.html#overrides)


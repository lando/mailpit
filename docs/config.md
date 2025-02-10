---
title: Configuration
description: Learn how to configure the Lando Mailpit service.
---

# Configuration

Here are the configuration options, set to the default values, for this service. If you are unsure about where this goes or what this means we *highly recommend* scanning the [services documentation](https://docs.lando.dev/services/lando-3.html) to get a good handle on how the magicks work.

Also note that options, in addition to the [build steps](https://docs.lando.dev/services/lando-3.html#build-steps) and [overrides](https://docs.lando.dev/services/lando-3.html#overrides) that are available to every service, are shown below:

```yaml
services:
  pitformail:
    type: mailpit:1.22
    mailFrom: # Optional. The services to send mail from. Defaults to appserver.
      - appserver
```

## Port forwarding

`portforward` will allow you to access this service externally by assigning a port directly on your host's `localhost`. Note that `portforward` can be set to either `true` or a specific `port` but we *highly recommend* you set it to `true` unless you have pretty good knowledge of how port assignment works or you have a **very** compelling reason for needing a locked down port.

`portforward: true` will prevent inevitable port collisions and provide greater reliability and stability across Lando apps. That said, one downside of `portforward: true` is that Docker will assign a different port every time you restart your application. You can read more about accessing services externally [over here](https://docs.lando.dev/guides/external-access.html).

`tl;dr`

**Recommended**

```yaml
services:
  myservice:
    type: mailpit:1.22
    portforward: true
```

**Not recommended**

```yaml
services:
  myservice:
    type: mailpit:1.22
    portforward: 1025
```

## Sending Mail

You will need to list the services the wish to send mail from using the `mailFrom` config key. If an `appserver` service exists in your app, it will be included by default. Note that the services in the list should be other services in your application. They can be discovered by running [lando info](https://docs.lando.dev/cli/info.html).

::: warning Config may differ!
While we will automatically configure the underlying `mail` binary for any `php` service you choose to `mailFrom`, you may need to consult the documentation for the specific type of service you are choosing to send mail from.
:::

An example of a Landofile's `services` config that mails from a `php` service called `myphp` is shown below:

```yaml
services:
  mypit:
    type: mailpit:1.22
    mailFrom:
      - myphp
  myphp:
    type: php
```

Note that we will install the `mailpit` binary at `/helpers/mailpit` in each `mailFrom` service for you to use. Each of these services should also be able to access the Mailpit STMP server using the `MAIL_HOST` and `MAIL_PORT` environment variables.

## Getting information

You can get connection and credential information about your Mailpit instance by running [`lando info`](https://docs.lando.dev/cli/info.html). It may also be worth checking out our [accessing services externally guide](https://docs.lando.dev/guides/external-access.html).

---
title: Mailpit Lando Plugin
description: Add a configurable Mailpit service to Lando for local development with all the power of Docker and Docker Compose.
next: ./config.html
---

# Mailpit

[Mailpit](https://github.com/axllent/mailpit) is an email testing tool for developers.

You can easily add it to your Lando app by adding an entry to the [services](https://docs.lando.dev/services/lando-3.html) top-level config in your [Landofile](https://docs.lando.dev/landofile/).

```yaml
services:
  myservice:
    type: mailpit:1.22
```

## Supported versions

*   **[v1.22](https://hub.docker.com/r/axllent/mailpit/)** **(default)**
*   [custom](https://docs.lando.dev/services/lando-3.html#overrides)

## Patch versions

This service does not support patch versions but if you **really** need something like that you could consider using either a [custom compose service](https://docs.lando.dev/plugins/compose) or a service [overrides](https://docs.lando.dev/services/lando-3.html#overrides).

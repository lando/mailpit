---
title: Installation
description: How to install the Lando Mailpit Plugin.
---

# Installation

::: code-group
```sh [lando 3.21+]
lando plugin-add @lando/mailpit
```

```sh [hyperdrive]
# @NOTE: This doesn't actaully work yet
hyperdrive install @lando/mailpit
```

```sh [docker]
# Ensure you have a global plugins directory
mkdir -p ~/.lando/plugins

# Install plugin
# NOTE: Modify the "npm install @lando/mailpit" line to install a particular version eg
# npm install @lando/mailpit@1.1.0-beta.1
docker run --rm -it -v ${HOME}/.lando/plugins:/plugins -w /tmp node:20-alpine sh -c \
  "npm init -y \
  && npm install @lando/mailpit --production --flat --no-default-rc --no-lockfile --link-duplicates \
  && npm install --production --cwd /tmp/node_modules/@lando/mailpit \
  && mkdir -p /plugins/@lando \
  && mv --force /tmp/node_modules/@lando/mailpit /plugins/@lando/mailpit"

# Rebuild the plugin cache
lando --clear
```
:::

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/mailpit`. This command will also show you _where_ the plugin is being loaded from.

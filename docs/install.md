---
title: Installation
description: How to install the Lando Mailpit Plugin.
---

# Installation

You can install the Mailpit plugin with the following command:

```bash
lando plugin-add @lando/mailpit
```

You should be able to verify the plugin is installed by running `lando config --path plugins` and checking for `@lando/mailpit`. This command will also show you 
_where_ the plugin is being loaded from.

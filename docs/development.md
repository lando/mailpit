---
title: Development
description: Learn how to develop and contribute to the Lando Mailpit service
---

# Development

Development of this plugin happens on [GitHub](https://github.com/lando/mailpit).

## Requirements

At the very least you will need to have the following installed:

* [Lando 3.21.0+](https://docs.lando.dev/getting-started/installation.html) preferably installed [from source](https://docs.lando.dev/install/source.html)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node 20](https://nodejs.org/dist/latest-v20.x/)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/lando/mailpit.git
   cd mailpit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your development environment:
   - Ensure you have Node.js 20 or later installed
   - If you're using VS Code, consider installing the ESLint extension for real-time linting feedback

## Working with the Plugin

This plugin contains various working and tested Lando apps in the `examples/` folder. You should use these or create new ones to help with plugin development.

Each example contains the following section in its Landofile:

```yaml
plugins:
  "@lando/mailpit": ../..
```

This tells Lando that _this_ app should use the source version of the `@lando/mailpit` plugin you cloned down in the installation. This is useful because it allows you to isolate development within this repo without interfering with any other apps using the stable and global version of the plugin.

You should _almost always_ develop against apps in the `examples` folder and those apps should _always_ contain the above `plugins` config. If you have an existing Lando application you want to develop against, you can temporarily tell it to use the cloned down version of the plugin with:

```yaml
plugins:
  "@lando/mailpit": /path/to/plugin
```

## Repository Structure

This repository is structured as follows:

- `builders/`: Contains the main service builder for the Mailpit plugin
- `config/`: Contains configuration files used in services managed by the Mailpit plugin
- `docs/`: Documentation for the Mailpit plugin
- `examples/`: Example configurations and usage scenarios executed by Leia for testing
- `scripts/`: Contains scripts used by the Mailpit plugin inside apps
- `tasks/`: Contains Lando command implementations
- `test/`: Contains unit test files
- `utils/`: Utility functions used by the Mailpit plugin

## Documentation

If you want to help with contributing documentation, you can use these commands:

```bash
# launch local docs site
npm run docs:dev

# build docs locally
npm run docs:build

# preview built docs locally
npm run docs:build
```

The documentation uses [VitePress](https://vitepress.dev/) with our [custom theme](https://vitepress-theme-default-plus.lando.dev).

## Testing

This project uses both unit tests and integration tests:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:leia

# Run all tests
npm test
```

### Integration Tests with Leia

We use [Leia](https://github.com/lando/leia) for end-to-end testing. Leia is our custom testing framework that allows us to define tests as a series of shell commands in markdown files, making our tests both executable and human-readable documentation.

Each example in the `examples/` directory serves as a test case. The README.md in each example contains the test steps in this format:

```markdown
Start up tests
--------------

# Should start up successfully
lando start

Verification commands
---------------------

# Should be able to send mail
lando php /app/mail.php

# Should be able to see mail in the UI
lando exec mailpit -- curl localhost:8025/api/v1/messages

Destroy tests
-------------

# Should be able to destroy our app
lando destroy -y
```

The headers in these files are important:
- `Start up tests`: Commands that run before the main tests
- `Verification commands`: The main test steps (required)
- `Destroy tests`: Clean up commands to run after tests

To run the tests:

```bash
# Run all integration tests
npm run test:leia

# Run a specific test
npx leia examples/basic/README.md -c 'Destroy tests'
```

### Adding New Tests

When adding new test examples:

1. Create a new directory in `examples/`
2. Add a README.md with your test steps
3. Add the test to GitHub Actions by modifying the workflow file:

```yaml
jobs:
  leia-tests:
    strategy:
      fail-fast: false
      matrix:
        leia-test:
          - examples/basic
          - examples/advanced
          # Add your new test here
```

### Linting

This project uses ESLint for code linting. The configuration is defined in `eslint.config.js` using the new flat config format:

```bash
npm run lint
```

## Releasing

To deploy and publish a new version:

1. [Create a release on GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
2. Use semantic versioning for the release title (e.g. `v1.1.2`)
3. The GitHub release will automatically prepare and deploy to NPM

Note:
- Creating a "pre-release" will tag the NPM package with `edge` instead of `latest`
- To install specific versions:
  ```bash
  # Latest stable release
  npm install @lando/mailpit
  # Latest pre-release
  npm install @lando/mailpit@edge
  ```

## Contributing

We welcome contributions! Please follow [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) for contributions.

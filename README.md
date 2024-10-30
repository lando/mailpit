# Mailpit Integration Plugin for Lando
The official [Mailpit](https://mailpit.axllent.org) integration plugin for [Lando](https://lando.dev).

This is a work in progress. PRs and feedback are appreciated!

## Planned Features

- [x] A Mailpit service for receiving emails.
- [x] Mailpit UI accessible at http and https routes.
- [x] Automatic configuration of services to send mail to Mailpit.
- [x] Automatic installation of Mailpit sendmail client and configuration into services that need it.
- [ ] Automatic proxy configuration for the Mailpit UI.
- [ ] A global mailpit service that multiple apps can use.
- [ ] A `lando mailpit` command that interacts with the mailpit service.
- [ ] Automatic configuration of popular frameworks to send mail to Mailpit.
- [ ] Add a mailpit service to a recipe with a single line of configuration.

## Installation

Install the Mailpit plugin:
```bash
lando plugin-add @lando/mailpit
```

Add a mailpit service to your landofile:
```yaml
name: mysite
services:
  mailpit:
    type: mailpit
    mailFrom: # Optional. The services to send mail from. Defaults to appserver.
      - appserver

proxy:
  mailpit:
    - mailpit.mysite.lndo.site
```

Send mail from your app:
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

// The email will be captured by Mailpit and viewable at:
// http://mailpit.mysite.lndo.site
```

## Contributing

To get started with contributing to this project, follow these steps:

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
   - Ensure you have Node.js 20 or later installed.
   - If you're using VS Code, consider installing the ESLint extension for real-time linting feedback.

4. Run the tests to verify the current state of the project:
   ```bash
   npm test
   ```

Now you're ready to start developing! Check the issues page for tasks to work on, or feel free to propose new features or improvements.

### Repository Structure

This repository is structured as follows:

- `builders/`: Contains the main service builder for the Mailpit plugin.
- `config/`: Contains configuration files used in services managed by the Mailpit plugin.
- `test/`: Contains unit test files.
- `examples/`: Example configurations and usage scenarios executed by Leia for testing.
- `utils/`: Utility functions used by the Mailpit plugin.

### Linting

This project uses ESLint for code linting. The configuration is defined in `eslint.config.js` using the new flat config format. We use the Google ESLint configuration as a base and extend it with custom rules, including JSDoc validation.

To run the linter, use:

```bash
npm run lint
```

### Testing

This project uses Mocha for unit testing. To run the tests, follow these steps:

1. Ensure you have all dependencies installed:
   ```
   npm install
   ```

2. Run the unit tests:
   ```
   npm run test:unit
   ```

The test files are located in the `test` directory. The main test file for the Mailpit builder is `test/mailpit.spec.js`.

We also use [Leia](https://github.com/lando/leia) for integration testing. Leia steps through the README files in the `examples` directory,
executes the examples as if they were a user, and validates things are rolling as they should. To run these tests:

```bash
npm run test:leia
```

To run all tests (unit and Leia):

```bash
npm test
```

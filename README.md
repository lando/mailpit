# Mailpit Plugin for Lando
A [Mailpit](https://mailpit.axllent.org) integration plugin for Lando.

This is a work in progress. PRs and feedback are appreciated!

## Developer Information

To get started with this project, follow these steps:

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
   - Ensure you have Node.js 18 or later installed.
   - If you're using VS Code, consider installing the ESLint extension for real-time linting feedback.

4. Run the tests to verify the current state of the project:
   ```bash
   npm test
   ```

Now you're ready to start developing! Check the issues page for tasks to work on, or feel free to propose new features or improvements.

### Repository Structure

This repository is structured as follows:

- `builders/`: Contains the main service builder for the Mailpit plugin.
- `config/`: Contains configuration files used by the Mailpit plugin.
- `test/`: Contains unit test files.
- `examples/`: Example configurations and usage scenarios executed by Leia for testing.

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

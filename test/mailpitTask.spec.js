'use strict';

/**
 * @file Unit tests for the mailpit task
 * @module tests/mailpitTask.spec
 *
 * This file contains unit tests for the mailpit task.
 * It tests the functionality of the mailpit task, including
 * displaying connection information, handling errors, and
 * verifying command metadata.
 *
 * @requires chai
 * @requires sinon
 * @requires tasks/mailpit
 */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

// Import the task module
const mailpitTask = require('../tasks/mailpit.js');

/**
 * Test suite for the mailpit task
 */
describe('mailpit task', () => {
  /** @type {sinon.SinonSpy} */
  let logSpy;
  /** @type {sinon.SinonSpy} */
  let errorSpy;
  /** @type {object} */
  let lando;

  /**
   * Setup test environment before each test
   * @returns {void}
   */
  beforeEach(() => {
    // Create spies for lando.log methods
    logSpy = sinon.spy();
    errorSpy = sinon.spy();

    // Mock lando object
    lando = {
      log: {
        info: logSpy,
        error: errorSpy,
      },
    };
  });

  /**
   * Clean up after each test
   * @returns {void}
   */
  afterEach(() => {
    // Clean up
    sinon.restore();
  });

  /**
   * Test displaying mailpit connection information when service exists
   * @returns {void}
   */
  it('should display mailpit connection information when service exists', () => {
    // Create task with our mocked lando
    const task = mailpitTask(lando);

    // Mock app info with mailpit service
    const options = {
      _app: {
        info: [{
          service: 'smtpserver',
          type: 'mailpit',
          mailFrom: ['phpserver'],
          internal_connection: {
            host: 'smtpserver',
            port: 1025,
          },
        }],
      },
    };

    // Run the task
    task.run(options);

    // Verify correct info was logged
    expect(logSpy.calledWith('Mailpit Connection Information')).to.be.true;
    expect(logSpy.calledWith('SMTP Server Details:')).to.be.true;
    expect(logSpy.calledWith('Host: smtpserver')).to.be.true;
    expect(logSpy.calledWith('Port: 1025')).to.be.true;
    expect(logSpy.calledWith('- phpserver (configured to use sendmail)')).to.be.true;
    expect(logSpy.calledWith('MAIL_HOST=smtpserver')).to.be.true;
    expect(logSpy.calledWith('MAIL_PORT=1025')).to.be.true;
  });

  /**
   * Test error handling when no mailpit service exists
   * @returns {void}
   */
  it('should show error when no mailpit service exists', () => {
    const task = mailpitTask(lando);

    // Mock app info without mailpit service
    const options = {
      _app: {
        info: [{
          service: 'phpserver',
          type: 'php',
        }],
      },
    };

    // Run the task
    task.run(options);

    // Verify error was logged
    expect(errorSpy.calledWith('No Mailpit service found in this app')).to.be.true;
    // Verify no other logs were made
    expect(logSpy.called).to.be.false;
  });

  /**
   * Test handling mailpit service without mailFrom configuration
   * @returns {void}
   */
  it('should handle mailpit service without mailFrom configuration', () => {
    const task = mailpitTask(lando);

    // Mock app info with mailpit service but no mailFrom
    const options = {
      _app: {
        info: [{
          service: 'smtpserver',
          type: 'mailpit',
          internal_connection: {
            host: 'smtpserver',
            port: 1025,
          },
        }],
      },
    };

    // Run the task
    task.run(options);

    // Verify basic info was logged
    expect(logSpy.calledWith('Mailpit Connection Information')).to.be.true;
    expect(logSpy.calledWith('SMTP Server Details:')).to.be.true;
    // Verify mailFrom related messages were not logged
    expect(logSpy.calledWith('Pre-configured Services:')).to.be.false;
  });

  /**
   * Test command metadata
   * @returns {void}
   */
  it('should have correct command metadata', () => {
    const task = mailpitTask(lando);

    expect(task.command).to.equal('mailpit');
    expect(task.describe).to.equal('Shows Mailpit connection information');
    expect(task.usage).to.equal('$0 mailpit');
    expect(task.examples).to.deep.equal(['$0 mailpit']);
  });
});

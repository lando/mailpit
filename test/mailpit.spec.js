'use strict';

/**
 * @file Unit tests for the Mailpit service builder.
 * @module test/mailpit.spec
 *
 * This file contains unit tests for the Mailpit service builder.
 * It tests the functionality of the LandoMailpitService class created by the
 * builder, including default options, environment variables, and other
 * configurations. Run with `npm run test:unit`
 *
 * @requires chai
 * @requires builders/mailpit
 */

const DEFAULT_MAILPIT_VERSION = '1.27';

const chai = require('chai');
const expect = chai.expect;
const mailpitBuilder = require('../builders/mailpit');

describe('Mailpit Builder', function() {
  let mockParent;
  let mockOptions;

  beforeEach(function() {
    mockParent = class MockParent {
      constructor(id, options = {}, ...sources) {
        this.id = id;
        // Create a deep copy of options
        this.options = JSON.parse(JSON.stringify(options));
        this.sources = sources;
      }
    };

    // Mock options that would be passed to the constructor
    mockOptions = {
      data: 'data_smtpserver',
      meUser: undefined,
      mailFrom: ['phpserver'],
      info: undefined,
      name: 'smtpserver',
      port: undefined,
      sources: undefined,
      confSrc: '/home/username/.lando/plugins/@lando/mailpit/config',
      confDest: '/home/username/.lando/config/mailpit',
      _app: {
        config: {
          services: {
            phpserver: {},
          },
        },
        log: {
          debug: () => {}, // Mock debug function
        },
        _lando: {
          utils: require('@lando/core/lib/utils'),
        },
      },
    };
  });

  it('should create a LandoMailpitService class with correct configuration', () => {
    const LandoMailpitService = mailpitBuilder.builder(mockParent, mailpitBuilder.config);
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    expect(instance).to.be.instanceof(mockParent);
    expect(instance.id).to.equal('smtpserver');
    expect(instance.options.name).to.equal('smtpserver');
    expect(instance.options.data).to.equal('data_smtpserver');
    expect(instance.options.mailFrom).to.deep.equal(['phpserver']);
  });

  it('should use default values when not provided in options', () => {
    const LandoMailpitService = mailpitBuilder.builder(
        mockParent,
        mailpitBuilder.config,
    );
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    expect(instance.options.version).to.equal(DEFAULT_MAILPIT_VERSION); // Adjusted to match the correct default version
    expect(instance.options.maxMessages).to.equal(500);
  });

  it('should set meUser to root', () => {
    const LandoMailpitService = mailpitBuilder.builder(
        mockParent,
        mailpitBuilder.config,
    );
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    expect(instance.options.meUser).to.equal('root');
  });

  it('should configure correct sources', () => {
    const LandoMailpitService = mailpitBuilder.builder(
        mockParent,
        mailpitBuilder.config,
    );
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    // The sources array should now have two items
    expect(instance.sources).to.have.lengthOf(2);
    expect(instance.sources[0]).to.have.nested.property('services.phpserver');
    expect(instance.sources[1]).to.have.nested.property('services.smtpserver');

    const mailpitService = instance.sources[1].services.smtpserver;
    expect(mailpitService.image).to.equal(`axllent/mailpit:v${DEFAULT_MAILPIT_VERSION}`); // Adjusted to match the correct default version
    expect(mailpitService.command).to.equal('/mailpit');
    expect(mailpitService.environment).to.deep.include({
      TERM: 'xterm',
      MP_UI_BIND_ADDR: '0.0.0.0:80',
      MP_SMTP_AUTH_ACCEPT_ANY: 1,
      MP_SMTP_AUTH_ALLOW_INSECURE: 1,
      MP_MAX_MESSAGES: 500,
      MP_DATABASE: '/data/mailpit.sqlite',
    });
    expect(mailpitService.ports).to.deep.equal(['80']); // Adjusted to match the correct default port
    expect(mailpitService.volumes).to.deep.equal(['data_smtpserver:/data']);
  });

  it('should configure other services when mailFrom is provided', () => {
    const LandoMailpitService = mailpitBuilder.builder(mockParent, mailpitBuilder.config);
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    // Check that the mailFrom services are configured in options.sources
    const phpserverSource = instance.options.sources.find(source =>
      source.services?.phpserver,
    );

    expect(phpserverSource).to.exist;
    expect(phpserverSource.services.phpserver.environment).to.deep.include({
      MAIL_HOST: 'smtpserver',
      MAIL_PORT: 1025,
    });

    expect(phpserverSource.services.phpserver.volumes).to.deep.include(
        '/home/username/.lando/config/mailpit/php.ini:/usr/local/etc/php/conf.d/zzzz-lando-mailpit.ini',
    );
  });

  it('should use default port when not provided in options', () => {
    const LandoMailpitService = mailpitBuilder.builder(mockParent, mailpitBuilder.config);
    const instance = new LandoMailpitService('smtpserver', mockOptions);

    expect(instance.options.port).to.equal(1025);
  });

  it('should override default values with provided options', () => {
    const customOptions = {
      ...mockOptions,
      version: '1.19',
      maxMessages: 2012,
      port: 2025,
    };
    const LandoMailpitService = mailpitBuilder.builder(mockParent, mailpitBuilder.config);
    const instance = new LandoMailpitService('smtpserver', customOptions);

    expect(instance.options.version).to.equal('1.19');
    expect(instance.options.maxMessages).to.equal(2012);
    expect(instance.options.port).to.equal(2025);
  });
});

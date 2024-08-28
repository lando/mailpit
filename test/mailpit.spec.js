'use strict';
/**
 * @fileoverview This file contains unit tests for the Mailpit service builder.
 * It tests the functionality of the LandoMailpit class created by the builder,
 * including default options, environment variables, and other configurations.
 * 
 * @requires lodash
 * @requires chai
 * @requires ../builders/mailpit
 */

const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const mailpitBuilder = require('../builders/mailpit');

describe('Mailpit Builder', function() {
  let mockParent;
  let mockConfig;

  beforeEach(function() {
    mockParent = class MockParent {
      constructor(id, options = {}, ...sources) {
        this.id = id;
        this.options = _.merge({}, options);
        
        // Simulate the behavior of the parent classes
        this.options.name = options.name || id;
        this.options.meUser = options.meUser || 'www-data';
        this.options.info = _.merge({}, options.info, {
          service: this.options.name,
          type: options.type || 'mailpit',
          version: options.version,
          meUser: this.options.meUser,
          hasCerts: options.ssl || false,
          api: 3,
        });

        // Simulate the sources array
        this.sources = sources;
      }
    };

    mockConfig = _.cloneDeep(mailpitBuilder.config);
    mockConfig.data = '/mock/data/path';
  });

  it('should create a LandoMailpit class', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    expect(LandoMailpit).to.be.a('function');
    expect(new LandoMailpit('mailpit')).to.be.instanceof(mockParent);
  });

  it('should set correct default options', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    expect(instance.options.version).to.equal('1.20');
    expect(instance.options.supported).to.deep.equal(['1.20']);
    expect(instance.options.relayFrom).to.deep.equal([]);
    expect(instance.options.maxMessages).to.equal(1000);
    expect(instance.sources).to.be.an('array').that.is.not.empty;
  });

  it('should set meUser to root', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    expect(instance.options.meUser).to.equal('root');
    expect(instance.options.info.meUser).to.equal('root');
  });

  it('should set correct environment variables', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    const mailpitService = instance.sources[0].services['undefined'];
    
    expect(mailpitService).to.exist;
    expect(mailpitService.environment).to.deep.include({
      TERM: 'xterm',
      MP_UI_BIND_ADDR: '0.0.0.0:80',
      MP_SMTP_AUTH_ACCEPT_ANY: 1,
      MP_SMTP_AUTH_ALLOW_INSECURE: 1,
      MP_MAX_MESSAGES: 1000,
    });
  });

  it('should set correct image and command', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    const mailpitService = instance.sources[0].services['undefined'];
    
    expect(mailpitService).to.exist;
    expect(mailpitService.image).to.equal('axllent/mailpit:v1.20');
    expect(mailpitService.command).to.equal('/mailpit');
  });

  it('should set correct ports and volumes', () => {
    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    const mailpitService = instance.sources[0].services['undefined'];
    
    expect(mailpitService).to.exist;
    expect(mailpitService.ports).to.deep.equal(['1025']);
    expect(mailpitService.volumes).to.include('/mock/data/path:/data');
  });

  it('should configure other services to use Mailpit', () => {
    mockConfig.relayFrom = ['appserver'];
    mockConfig.name = 'mailpit';
    mockConfig.port = 1025;

    const LandoMailpit = mailpitBuilder.builder(mockParent, mockConfig);
    const instance = new LandoMailpit('mailpit');

    const appserverSource = instance.sources.find(source => 
      source.services && source.services.appserver
    );

    expect(appserverSource).to.exist;
    expect(appserverSource.services.appserver.environment).to.deep.equal({
      MAIL_HOST: 'mailpit',
      MAIL_PORT: 1025,
    });
  });
});

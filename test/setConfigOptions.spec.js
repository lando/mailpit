'use strict';
/**
 * SetConfigOptions spec
 * @requires chai
 * @requires utils/setConfigOptions
 */

const chai = require('chai');
const expect = chai.expect;
const setConfigOptions = require('../utils/setConfigOptions');

describe('setConfigOptions Utility', () => {
  let mockApp;

  beforeEach(() => {
    mockApp = {
      config: {
        services: {
          testService: {},
        },
      },
    };
  });

  it('should set configuration options correctly', () => {
    const options = {
      ssl: true,
      sslExpose: false,
      scanner: {
        okCodes: [200, 201],
      },
    };

    setConfigOptions(options, mockApp, 'testService');

    expect(mockApp.config.services.testService.ssl).to.be.true;
    expect(mockApp.config.services.testService.sslExpose).to.be.false;
    expect(mockApp.config.services.testService.scanner).to.deep.equal({
      okCodes: [200, 201],
    });
  });

  it('should handle non-existent services', () => {
    const options = {
      newOption: 'value',
    };

    setConfigOptions(options, mockApp, 'nonExistentService');

    expect(mockApp.config.services.nonExistentService.newOption).to.equal('value');
  });

  it('should overwrite existing options', () => {
    mockApp.config.services.testService.existingOption = 'oldValue';

    const options = {
      existingOption: 'newValue',
    };

    setConfigOptions(options, mockApp, 'testService');

    expect(mockApp.config.services.testService.existingOption).to.equal('newValue');
  });
});

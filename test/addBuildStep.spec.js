'use strict';

const chai = require('chai');
const expect = chai.expect;
const addBuildStep = require('../utils/addBuildStep');

describe('addBuildStep Utility', () => {
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

  const validSteps = ['build_internal', 'build_as_root_internal', 'build', 'build_as_root', 'run', 'run_as_root'];

  validSteps.forEach(stepType => {
    it(`should handle ${stepType} steps correctly`, () => {
      // Test adding a single step
      addBuildStep('echo "Step 1"', mockApp, 'testService', stepType);
      expect(mockApp.config.services.testService[stepType]).to.deep.equal(['echo "Step 1"']);

      // Test adding multiple steps
      addBuildStep(['npm install', 'npm run build'], mockApp, 'testService', stepType);
      expect(mockApp.config.services.testService[stepType]).to.deep.equal([
        'echo "Step 1"',
        'npm install',
        'npm run build',
      ]);

      // Test prepending steps
      addBuildStep(['apt-get update'], mockApp, 'testService', stepType, true);
      expect(mockApp.config.services.testService[stepType]).to.deep.equal([
        'apt-get update',
        'echo "Step 1"',
        'npm install',
        'npm run build',
      ]);

      // Test removing duplicates
      addBuildStep(['echo "Step 1"', 'yarn install'], mockApp, 'testService', stepType);
      expect(mockApp.config.services.testService[stepType]).to.deep.equal([
        'apt-get update',
        'echo "Step 1"',
        'npm install',
        'npm run build',
        'yarn install',
      ]);
    });
  });

  it('should use build_internal as default when no step type is specified', () => {
    addBuildStep('echo "Default step"', mockApp, 'testService');
    expect(mockApp.config.services.testService.build_internal).to.deep.equal(['echo "Default step"']);
  });

  it('should handle non-existent services', () => {
    addBuildStep('echo "New service step"', mockApp, 'nonExistentService');
    expect(mockApp.config.services.nonExistentService.build_internal).to.deep.equal(['echo "New service step"']);
  });

  it('should throw an error for invalid step types', () => {
    expect(() => addBuildStep('echo "Invalid step"', mockApp, 'testService', 'invalid_step'))
        .to.throw('Invalid build step type: invalid_step');
  });
});

'use strict';

const _ = require('lodash');

/**
 * Adds build steps to a service
 * @param {string|string[]} steps - The build step(s) to add
 * @param {object} app - The Lando app object
 * @param {string} name - The name of the service
 * @param {string} [step] - The build step to modify. Valid values are:
 *   'build_internal', 'build_as_root_internal', 'build', 'build_as_root', 'run', 'run_as_root'
 * @param {boolean} [front] - Whether to add the steps to the front of the array
 * @throws {Error} Will throw an error if an invalid step type is provided
 */
module.exports = (steps, app, name, step = 'build_internal', front = false) => {
  const validSteps = ['build_internal', 'build_as_root_internal', 'build', 'build_as_root', 'run', 'run_as_root'];

  if (!validSteps.includes(step)) {
    throw new Error(`Invalid build step type: ${step}`);
  }

  const current = _.get(app, `config.services.${name}.${step}`, []);
  const add = (front) ? _.flatten([steps, current]) : _.flatten([current, steps]);
  _.set(app, `config.services.${name}.${step}`, _.uniq(add));
};

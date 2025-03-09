'use strict';

/**
 * Adds build steps to a service
 * 
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

  // Get current steps or empty array if none exist
  const current = app.config.services?.[name]?.[step] || [];

  // Convert steps to array if it's a string
  const stepsArray = Array.isArray(steps) ? steps : [steps];

  // Combine arrays based on front parameter
  const combined = front ? [...stepsArray, ...current] : [...current, ...stepsArray];

  // Remove duplicates
  const uniqueSteps = [...new Set(combined)];

  // Ensure the path exists and set the value
  if (!app.config.services) {
    app.config.services = {};
  }

  if (!app.config.services[name]) {
    app.config.services[name] = {};
  }

  app.config.services[name][step] = uniqueSteps;
};

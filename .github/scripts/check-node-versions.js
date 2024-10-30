#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

/**
 * Get the required Node.js version from package.json
 * @returns {string} The Node.js version number
 */
function getRequiredNodeVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.engines.node.replace('>=', '');
}

/**
 * Check Node.js version in .lando.yml
 * @param {string} requiredVersion - The required Node.js version
 * @returns {string|null} Mismatch message if version differs, null if matches
 */
function checkLandoFile(requiredVersion) {
  const landoPath = '.lando.yml';
  const landoContent = fs.readFileSync(landoPath, 'utf8');
  const landoConfig = yaml.parse(landoContent);

  const currentVersion = landoConfig.services.node.image.split(':')[1];
  if (currentVersion !== requiredVersion) {
    return `- .lando.yml has node:${currentVersion}, expected node:${requiredVersion}`;
  }
  return null;
}

/**
 * Check Node.js version in workflow files
 * @param {string} requiredVersion - The required Node.js version
 * @returns {string[]} Array of mismatch messages
 */
function checkWorkflowFiles(requiredVersion) {
  const mismatches = [];
  const workflowsDir = '.github/workflows';

  const files = fs.readdirSync(workflowsDir)
      .filter(file => file.endsWith('.yml'));

  files.forEach(file => {
    const filePath = path.join(workflowsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const workflow = yaml.parse(content);

    const checkObject = obj => {
      for (const key in obj) {
        if (key === 'node-version' && typeof obj[key] === 'string') {
          const version = obj[key].replace(/['"]/g, '');
          if (version !== requiredVersion) {
            mismatches.push(`- ${filePath} has Node.js ${version}, expected ${requiredVersion}`);
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkObject(obj[key]);
        }
      }
    };

    checkObject(workflow);
  });

  return mismatches;
}

/**
 * Main function to check Node.js versions
 */
function main() {
  try {
    const requiredVersion = getRequiredNodeVersion();
    console.log(`Checking for Node.js version ${requiredVersion} across configuration files...`);

    const mismatches = [];

    const landoMismatch = checkLandoFile(requiredVersion);
    if (landoMismatch) mismatches.push(landoMismatch);

    const workflowMismatches = checkWorkflowFiles(requiredVersion);
    mismatches.push(...workflowMismatches);

    if (mismatches.length > 0) {
      console.error('\nNode.js version mismatches found:');
      console.error(mismatches.join('\n'));
      console.error('\nPlease update all Node.js versions to match package.json');
      process.exit(1);
    } else {
      console.log('All Node.js versions match package.json ✓');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

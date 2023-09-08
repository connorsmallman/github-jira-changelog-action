"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultConfig = getDefaultConfig;
exports.configFilePath = configFilePath;
exports.readConfigFile = readConfigFile;
exports.defaultValues = defaultValues;
exports.CONF_FILENAME = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _commander = _interopRequireDefault(require("commander"));

var _changelogConfig = _interopRequireDefault(require("../changelog.config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manages the command configuration files.
 *
 * If the `changelog.conf.js` file is in the directory the script is run in
 * these returned settings will overwrite the defaults.
 */

/**
 * Default config object
 */

/**
 * Name of the local config files.
 * Put this file in the directory where you call the jira-changelog command.
 */
const CONF_FILENAME = 'changelog.config.js';
/**
 * Return the default config object.
 * @return {Object}
 */

exports.CONF_FILENAME = CONF_FILENAME;

function getDefaultConfig() {
  return _changelogConfig.default;
}
/**
 * Return the path to the config file
 * @param {String} cwd - The current directory
 * @return {String}
 */


function configFilePath(cwd) {
  // Passed in on the command line
  if (_commander.default.config) {
    return _path.default.resolve(_commander.default.config);
  }

  return _path.default.join(cwd, CONF_FILENAME);
}
/**
 * Reads the config file, merges it with the default values and returns the object.
 *
 * @param {String} cwd - The current directory
 * @return {Object} Configuration object.
 */


function readConfigFile(cwd) {
  let localConf = {};
  const configPath = configFilePath(cwd);

  try {
    // Check if file exists
    _fs.default.accessSync(configPath);

    localConf = require(configPath);
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log('Error reading changelog.config.js:');
      console.log(e.stack);
      console.log(e.message);
    }
  }

  localConf = defaultValues(localConf, _changelogConfig.default);
  return localConf;
}
/**
 * Add the default values into the config object
 *
 * @param {Object} config - The config object to merge with the default values.
 * @param {Object} defaults - The default object
 * @return {Object}
 */


function defaultValues(config, defaults) {
  const localConf = { ...config
  };
  Object.entries(defaults).forEach(([key, defVal]) => {
    if (typeof defVal === 'object' && !Array.isArray(defVal)) {
      localConf[key] = Object.assign({}, defVal, localConf[key] || {});
    } else if (typeof localConf[key] == 'undefined') {
      localConf[key] = defVal;
    }
  });
  return localConf;
}
//# sourceMappingURL=Config.js.map
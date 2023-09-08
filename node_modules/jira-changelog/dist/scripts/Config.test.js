"use strict";

var Config = _interopRequireWildcard(require("./Config"));

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('Config file path', () => {
  test('Returns config file on current path', () => {
    const configPath = Config.configFilePath('foobar/');
    expect(configPath).toBe('foobar/changelog.config.js');
  });
  test('Return cli config file path', () => {
    _commander.default.config = '/custom/path/bar.config.js';
    const configPath = Config.configFilePath('foobar/');
    expect(configPath).toBe(_commander.default.config);
  });
});
describe('Default values', () => {
  test('only add default values', () => {
    const obj1 = {
      foo: 'bar'
    };
    const defaults = {
      foo: 'baz',
      hello: 'world'
    };
    const merged = Config.defaultValues(obj1, defaults);
    expect(merged).toEqual({
      foo: 'bar',
      hello: 'world'
    });
  });
  test('merges nested objects', () => {
    const obj1 = {
      nested: {
        foo: 'bar'
      }
    };
    const defaults = {
      nested: {
        foo: 'baz',
        hello: 'world'
      }
    };
    const merged = Config.defaultValues(obj1, defaults);
    expect(merged).toEqual({
      nested: {
        foo: 'bar',
        hello: 'world'
      }
    });
  });
  test('does not merge arrays', () => {
    const obj1 = {
      arr1: [2, 4, 6]
    };
    const defaults = {
      arr1: [1, 3, 5],
      arr2: [6, 7, 8]
    };
    const merged = Config.defaultValues(obj1, defaults);
    expect(merged).toEqual({
      arr1: [2, 4, 6],
      arr2: [6, 7, 8]
    });
  });
});
//# sourceMappingURL=Config.test.js.map
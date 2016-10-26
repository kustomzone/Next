'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);

var _MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');

var _MultiEntryPlugin2 = _interopRequireDefault(_MultiEntryPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DynamicEntryPlugin = function () {
  function DynamicEntryPlugin() {
    (0, _classCallCheck3.default)(this, DynamicEntryPlugin);
  }

  (0, _createClass3.default)(DynamicEntryPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.entryNames = getInitialEntryNames(compiler);
      compiler.addEntry = addEntry;
      compiler.removeEntry = removeEntry;
      compiler.hasEntry = hasEntry;

      compiler.plugin('compilation', function (compilation) {
        compilation.addEntry = compilationAddEntry(compilation.addEntry);
      });
    }
  }]);
  return DynamicEntryPlugin;
}();

exports.default = DynamicEntryPlugin;


function getInitialEntryNames(compiler) {
  var entryNames = new _set2.default();
  var entry = compiler.options.entry;


  if (typeof entry === 'string' || Array.isArray(entry)) {
    entryNames.add('main');
  } else if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) === 'object') {
    (0, _keys2.default)(entry).forEach(function (name) {
      entryNames.add(name);
    });
  }

  return entryNames;
}

function addEntry(entry) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'main';
  var context = this.options.context;

  var Plugin = Array.isArray(entry) ? _MultiEntryPlugin2.default : _SingleEntryPlugin2.default;
  this.apply(new Plugin(context, entry, name));
  this.entryNames.add(name);
}

function removeEntry() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main';

  this.entryNames.delete(name);
}

function hasEntry() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main';

  return this.entryNames.has(name);
}

function compilationAddEntry(original) {
  return function (context, entry, name, callback) {
    if (!this.compiler.entryNames.has(name)) {
      // skip removed entry
      callback();
      return;
    }

    return original.call(this, context, entry, name, callback);
  };
}
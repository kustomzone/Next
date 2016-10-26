'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (question) {
  var rlInterface = _readline2.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new _promise2.default(function (resolve) {
    rlInterface.question(question + '\n', function (answer) {
      rlInterface.close();
      resolve(answer);
    });
  });
};

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
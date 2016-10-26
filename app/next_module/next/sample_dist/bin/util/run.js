'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _prompt = require('./prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _detectPort = require('detect-port');

var _detectPort2 = _interopRequireDefault(_detectPort);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(srv, desiredPort) {
    var port, question, answer, shouldChangePort;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _detectPort2.default)(desiredPort);

          case 2:
            port = _context.sent;

            if (!(port !== desiredPort)) {
              _context.next = 10;
              break;
            }

            question = _chalk2.default.red('Something is already running at port ' + desiredPort + '.\n' + ('Would you like to run the app on port ' + port + ' instead? [Y/n]'));
            _context.next = 7;
            return (0, _prompt2.default)(question);

          case 7:
            answer = _context.sent;
            shouldChangePort = answer.length === 0 || answer.match(/^yes|y$/i);

            if (!shouldChangePort) {
              console.log(_chalk2.default.red('Exiting.'));
              process.exit(0);
            }

          case 10:
            _context.next = 12;
            return srv.start(port);

          case 12:
            console.log('Ready on ' + _chalk2.default.cyan('http://localhost:' + port));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function run(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return run;
}();
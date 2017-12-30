/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Neo4j = __webpack_require__(1);

var _Neo4j2 = _interopRequireDefault(_Neo4j);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = __webpack_require__(3);
var app = express();
//const neo4j = require('./DBDriver/Neo4j');

var DBDriver = new _Neo4j2.default('bolt://localhost', 'neo4j', 'neo.yuukosan.4j');

app.get('/', function (req, res) {
  res.send('Hello Wxssosrld!');
  DBDriver.runStatement('MATCH (n) RETURN ns LIMIT 25');
});

var cb0 = function cb0(req, res, next) {
  console.log('CB0');
  next();
};

var cb1 = function cb1(req, res, next) {
  console.log('CB1');
  next();
};

var cb2 = function cb2(req, res) {
  res.send('Hello from C!');
};

app.get('/example/c', [cb0, cb1, cb2]);

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var neo4j = __webpack_require__(2).v1;

var Neo4j = function () {
    function Neo4j(bolt, username, password) {
        _classCallCheck(this, Neo4j);

        this._driver = null;

        console.log('error');
        this._driver = neo4j.driver(bolt, neo4j.auth.basic(username, password), { maxTransactionRetryTime: 30000 });
    }

    _createClass(Neo4j, [{
        key: 'close',
        value: function close() {
            if (this._driver != null) this._driver.close();
        }
    }, {
        key: 'runStatement',
        value: function runStatement(statement) {
            if (this._driver != null) {
                var session = this._driver.session();

                session.run(statement).then(function (result) {
                    result.records.forEach(function (record) {
                        console.log(record);
                    });

                    session.close();
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }]);

    return Neo4j;
}();

exports.default = Neo4j;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("neo4j-driver");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ })
/******/ ]);
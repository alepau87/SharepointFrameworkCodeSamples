define("2c251523a11b107c6252a34fcf690881", [], function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));
	__export(__webpack_require__(2));
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var ComplexCalculator = (function () {
	    function ComplexCalculator() {
	    }
	    ComplexCalculator.prototype.sqr = function (v1) {
	        return v1 * v1;
	    };
	    ComplexCalculator.prototype.multiply = function (v1, v2) {
	        return v1 * v2;
	    };
	    return ComplexCalculator;
	}());
	exports.ComplexCalculator = ComplexCalculator;
	


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var EasyCalculator = (function () {
	    function EasyCalculator() {
	    }
	    EasyCalculator.prototype.sum = function (v1, v2) {
	        return v1 + v2;
	    };
	    EasyCalculator.prototype.subtraction = function (v1, v2) {
	        return v1 - v2;
	    };
	    return EasyCalculator;
	}());
	exports.EasyCalculator = EasyCalculator;
	


/***/ }
/******/ ])});;
//# sourceMappingURL=calculator.bundle.js.map
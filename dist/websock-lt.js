/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["websock-lt"] = factory();
	else
		root["websock-lt"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"send_ws_msg\": () => (/* binding */ send_ws_msg),\n/* harmony export */   \"start_ws\": () => (/* binding */ start_ws)\n/* harmony export */ });\nconst start_ws = _start_ws;\nconst send_ws_msg = _send_ws_msg;\nlet connection = null,\n  retry_itv = null,\n  last_msg = null;\nconst CONFIG = window.CONFIG || {};\nfunction _start_ws(opts) {\n  const {\n    port,\n    callback,\n    preserve_last_message\n  } = opts;\n  port = port || '6789';\n  CONFIG.preserve_last_message = preserve_last_message;\n  return new Promise(resolve => {\n    try {\n      _connect_to_ws(port, callback, resolve);\n    } catch (e) {\n      resolve();\n    }\n  });\n}\nfunction _connect_to_ws(port, callback, resolve) {\n  console.info(\"Connecting to websocket...\");\n  connection = new WebSocket('ws://localhost:' + port);\n  connection.addEventListener('open', function () {\n    console.info('WebSocket Client Connected');\n    const _call_cb = d => {\n      callback && callback(JSON.parse(d));\n    };\n    last_msg && _call_cb(last_msg);\n    connection.addEventListener('message', function (message) {\n      let data = message.utf8Data || message.data;\n      if (CONFIG._DEBUG_) console.log(\"Received: '\" + data + \"'\");\n      if (CONFIG.preserve_last_message) last_msg = data;\n      _call_cb(data);\n    });\n    resolve && resolve(connection);\n  });\n  connection.addEventListener('error', function (error) {\n    if (CONFIG._DEBUG_) console.log(\"Connection Error: \" + error.toString());\n    connection = null;\n    resolve && resolve();\n  });\n  connection.addEventListener('close', function () {\n    console.warn('Websocket Connection Closed');\n    connection = null;\n    if (!retry_itv) {\n      retry_itv = setInterval(() => {\n        if (connection) {\n          clearInterval(retry_itv);\n          retry_itv = null;\n          return;\n        }\n        _connect_to_ws(port, callback, resolve);\n      }, 3000);\n    }\n  });\n}\nlet warning_message_given = false;\nfunction _send_ws_msg(data) {\n  if (!(connection || {}).readyState) {\n    if (!warning_message_given)\n      //give it just once\n      console.warn(\"No WS Connection available: No color sent\");\n    warning_message_given = true;\n    return;\n  }\n  let msg = JSON.stringify(data);\n  if (CONFIG._DEBUG_) console.info(\"MSG\", msg);\n  if (CONFIG.preserve_last_message) last_msg = msg;\n  connection.send(msg);\n}\n\n//# sourceURL=webpack://websock-lt/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
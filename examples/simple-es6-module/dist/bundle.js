/******/ (function(modules) { // webpackBootstrap
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

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _uioc = __webpack_require__(1);
	
	var _config = __webpack_require__(6);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ioc = new _uioc.IoC(_config2.default);
	ioc.getComponent(['listA', 'listB']).then(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var listA = _ref2[0];
	    var listB = _ref2[1];
	
	    listA.render();
	    listB.render();
	}).catch(function (e) {
	    console.log(e);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {!function(e,t){ true?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.uioc=e.uioc||{})}(this,function(e){"use strict";function t(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function n(e,t){e.indexOf(t)===-1&&e.push(t)}function r(e){return Object.prototype.toString.call(e)===d}function o(e){return e&&"object"===("undefined"==typeof e?"undefined":c(e))&&"function"==typeof e.then}function i(){"undefined"!=typeof console&&Function.prototype.apply.call(console.warn,console,arguments)}function u(e){return r(e)&&"string"==typeof e.$ref}function a(e,t,n,r,o){var i=e.module;"function"!=typeof e.creator&&i&&(n[i]=n[i]||[],n[i].push(e)),t.processConfig(e.id);var u=r.checkForCircular(e.id);if(u){var s=e.id+" has circular dependencies ";throw new k(s,e)}r.addData(e);var c=r.appendChild(new O);o=o||e.argDeps.concat(e.propDeps).concat(e.setterDeps||[]);for(var f=o.length-1;f>-1;--f)t.hasComponent(o[f])&&a(t.getComponentConfig(o[f]),t,n,c);return n}function s(){return"function"=="function"&&__webpack_require__(3)&&"function"==typeof j.require?__webpack_require__(4):"undefined"!=typeof module&&module&&"exports"in module?function(e,t){return t.apply(void 0,y(e.map(function(e){return __webpack_require__(4)(e)})))}:void 0}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},f=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},v=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},y=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},d=Object.prototype.toString.call({}),m={hasOwn:t,addToSet:n,isObject:r,isPromise:o,hasRef:u,warn:i},g=Symbol("store"),C=Symbol("getInstance"),b=function(){function e(t){f(this,e),this.context=t,this[g]=Object.create(null)}return l(e,[{key:"createInstance",value:function(e){var t=this;if(!e)return Promise.resolve(null);var n=function(){switch(e.scope){case"singleton":var n=e.id;return n in t[g]||(t[g][n]=t[C](e).then(function(e){return t[g][n]=e})),{v:Promise.resolve(t[g][n])};case"transient":return{v:t[C](e)};case"static":return{v:Promise.resolve(e.creator)}}}();return"object"===("undefined"==typeof n?"undefined":c(n))?n.v:void 0}},{key:"injectArgs",value:function(e){var t=this,n=e.args;return Promise.all(n.map(function(e){return m.hasRef(e)?t.context.getComponent(e.$ref):e}))}},{key:"dispose",value:function(){var e=this[g];for(var t in e){var n=e[t];n&&"function"==typeof n.dispose&&n.dispose()}this[g]=null}},{key:C,value:function(e){return this.injectArgs(e).then(function(t){return e.creator.apply(e,y(t))})}}]),e}(),O=function(){function e(){f(this,e),this.data=[],this.children=[],this.parent=null}return l(e,[{key:"appendChild",value:function(e){return e.parent=this,this.children.push(e),e}},{key:"checkForCircular",value:function(e){var t=this.parent;if(null!==t)for(var n=t.data,r=n.length-1;r>-1;--r)return t.data[r].id&&t.data[r].id===e?t.data[r]:t.checkForCircular(e);return null}},{key:"addData",value:function(e,t){return(!t||!this.checkForCircular(e.id))&&(this.data.push(e),!0)}}]),e}(),k=function(e){function t(e,n){f(this,t);var r=v(this,Object.getPrototypeOf(t).call(this,e));return r.component=n,r}return h(t,e),l(t,[{key:"print",value:function(){if("undefined"!=typeof console){var e;(e=console).warn.apply(e,arguments)}}}]),t}(Error),P=function(){function e(t){f(this,e),this.amdLoader=s(),this.context=t}return l(e,[{key:"setLoaderFunction",value:function(e){this.amdLoader=e}},{key:"resolveDependentModules",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=arguments[2];return a(e,this.context,t,new O,n)}},{key:"loadModuleMap",value:function(e){var t=this,n=Object.keys(e);return new Promise(function(r){t.amdLoader(n,function(){for(var o=arguments.length,i=Array(o),u=0;u<o;u++)i[u]=arguments[u];i.forEach(function(r,o){var i=n[o];e[i].forEach(function(e){return"function"!=typeof e.creator&&t.wrapCreator(e,r)})}),r()})})}},{key:"wrapCreator",value:function(e,t){var n=e.creator=e.creator||t;e.isFactory||"static"===e.scope||(e.creator=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return new(Function.prototype.bind.apply(n,[null].concat(t)))})}}]),e}(),j=Function("return this")(),w=function(){function e(){f(this,e)}return l(e,[{key:"onContainerInit",value:function(e,t){return t}},{key:"onAddComponent",value:function(e,t,n){return n}},{key:"onGetComponent",value:function(e,t,n){return n}},{key:"beforeCreateInstance",value:function(e,t,n){}},{key:"afterCreateInstance",value:function(e,t,n){return Promise.resolve(n)}},{key:"onContainerDispose",value:function(e){}},{key:"name",get:function(){throw new Error("need to be implement")}}]),e}(),I="^uioc-",D=Symbol("cache"),S=function(e){function t(){f(this,t);var e=v(this,Object.getPrototypeOf(t).call(this));return e[D]=Object.create(null),e}return h(t,e),l(t,[{key:"name",get:function(){return"import"}}],[{key:"has",value:function(e){return m.isObject(e)&&"string"==typeof e.$import}},{key:"transformConfig",value:function(e,n){var r=n.args,o=null,i=r.reduce(function(i,u,a){return t.has(u)&&(o=t.createAnonymousConfig(e,u,n.id+"-$arg."+a+"."),r[a]={$ref:o},i.push(o)),i},[]),u=n.properties;for(var a in u)t.has(u[a])&&(o=t.createAnonymousConfig(e,u[a],n.id+"-$prop."+a+"."),u[a]={$ref:o},i.push(o));return i}},{key:"createAnonymousConfig",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=arguments[2],r=t.$import;if(!e.hasComponent(r))throw new Error("$import "+r+" component, but it is not exist, please check!!");var o=e.getComponentConfig(r);return t.id=(n.indexOf(I)!==-1?"":I)+n,t.$import=void 0,e.addComponent(t.id,p({},o,t)),t.id}}]),l(t,[{key:"onGetComponent",value:function(e,n,r){return this[D][n]?r:(this[D][n]=t.transformConfig(e,r),r)}}]),t}(w),A=/^set[A-Z]/,_="set".length,$=Symbol("cache"),F=function(e){function t(){f(this,t);var e=v(this,Object.getPrototypeOf(t).call(this));return e[$]=Object.create(null),e}return h(t,e),l(t,[{key:"name",get:function(){return"auto"}}],[{key:"getPropertyFromSetter",value:function(e,t){var n=null;return A.test(e)&&"function"==typeof t.value&&(n=e.charAt(_).toLowerCase()+e.slice(_+1)),n}},{key:"setProperty",value:function(e,t,n){var r="set"+t.charAt(0).toUpperCase()+t.slice(1);e[r](n)}}]),l(t,[{key:"afterCreateInstance",value:function(e,n,r){var o=this.resolveDependencies(e,n,r);return o.length?e.getComponent(o).then(function(e){return e.forEach(function(e,n){return t.setProperty(r,o[n],e)}),r}):Promise.resolve(r)}},{key:"resolveDependencies",value:function(e,n,r){if(this[$][n])return this[$][n];var o=e.getComponentConfig(n)||{};if(!o.auto)return this[$][n]=[],[];for(var i=o.properties||{},u=[],a=Object.create(null),s=function(n){var r=Object.getOwnPropertyNames(n);r.forEach(function(r){if(!a[r]){a[r]=!0;var o=Object.getOwnPropertyDescriptor(n,r);r=t.getPropertyFromSetter(r,o),r&&!m.hasOwn(i,r)&&e.hasComponent(r)&&u.push(r)}})},c=r;c;c=Object.getPrototypeOf(c))s(c);return this[$][n]=u,o.setterDeps=u,u}}]),t}(w),E=Symbol("cache"),N=function(e){function t(){f(this,t);var e=v(this,Object.getPrototypeOf(t).call(this));return e[E]=Object.create(null),e}return h(t,e),l(t,[{key:"name",get:function(){return"property"}}],[{key:"getSetter",value:function(e){if(m.isObject(e)&&"string"==typeof e.$setter)return e.$setter}},{key:"setProperty",value:function(e,t,n,r){if(r)return e[r](n);var o="set"+t.charAt(0).toUpperCase()+t.slice(1);"function"==typeof e[o]?e[o](n):e[t]=n}}]),l(t,[{key:"afterCreateInstance",value:function(e,n,r){if(!e.hasComponent(n))return Promise.resolve(r);var o=e.getComponentConfig(n),i=this.resolveDependencies(e,n),u=o.properties;return e.getComponent(i).then(function(e){for(var n in u){var o=u[n],a=m.hasRef(o)?e[i.indexOf(o.$ref)]:o;t.setProperty(r,n,a,t.getSetter(o))}return r})}},{key:"resolveDependencies",value:function(e,t){if(this[E][t])return this[E][t];var n=this[E][t]=[],r=e.getComponentConfig(t),o=r.properties;for(var i in o){var u=o[i];m.hasRef(u)&&n.push(u.$ref)}return r.propDeps=n,n}}]),t}(w),M=Symbol("cache"),x=function(e){function t(){f(this,t);var e=v(this,Object.getPrototypeOf(t).call(this));return e[M]=Object.create(null),e}return h(t,e),l(t,[{key:"name",get:function(){return"list"}}],[{key:"has",value:function(e){return m.isObject(e)&&e.$list instanceof Array}}]),l(t,[{key:"onContainerInit",value:function(e,t){return e.addComponent(this.constructor.LIST_ID,this.constructor.LIST_COMPONENT_CONFIG),t}},{key:"onGetComponent",value:function(e,n,r){if(this[M][n])return r;var o=this.constructor,i=o.has,u=o.LIST_ID;r.args=r.args.map(function(e){return i(e)?{$import:u,args:e.$list}:e});var a=r.properties;for(var s in a){var c=a[s];t.has(c)&&(a[s]={$import:u,args:c.$list})}return this[M][n]=!0,r}}]),t}(w);x.LIST_COMPONENT_CONFIG={creator:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t},isFactory:!0},x.LIST_ID=Date.now()+"_list";var T=Symbol("cache"),G=function(e){function t(){f(this,t);var e=v(this,Object.getPrototypeOf(t).call(this));return e[T]=Object.create(null),e}return h(t,e),l(t,[{key:"name",get:function(){return"map"}}],[{key:"has",value:function(e){return m.isObject(e)&&m.isObject(e.$map)}}]),l(t,[{key:"onContainerInit",value:function(e,t){return e.addComponent(this.constructor.MAP_ID,this.constructor.MAP_COMPONENT_CONFIG),t}},{key:"onGetComponent",value:function(e,n,r){if(this[T][n])return r;var o=this.constructor,i=o.has,u=o.MAP_ID;r.args=r.args.map(function(e){return i(e)?{$import:u,properties:e.$map}:e});var a=r.properties;for(var s in a){var c=a[s];t.has(c)&&(a[s]={$import:u,properties:c.$map})}return r}}]),t}(w);G.MAP_COMPONENT_CONFIG={creator:Object,isFactory:!0},G.MAP_ID=(new Date).getTime()+"_map";var L=function(e){function t(){return f(this,t),v(this,Object.getPrototypeOf(t).apply(this,arguments))}return h(t,e),l(t,[{key:"onContainerInit",value:function(e,t){return e.addComponent(this.constructor.AOP_ID,this.constructor.AOP_COMPONENT_CONFIG),t}},{key:"afterCreateInstance",value:function(e,t,n){var r=e.getComponentConfig(t)||{};return"aopConfig"in r?e.getComponent(this.constructor.AOP_ID).then(function(e){return(r.aopConfig.advisors||[]).reduce(function(t,n){var r=n.matcher,o=n.advices;return e.createObjectProxy(t,r,o)},n)}):Promise.resolve(n)}},{key:"name",get:function(){return"aop"}}]),t}(w);L.AOP_COMPONENT_CONFIG={module:"uaop",scope:"static"},L.AOP_ID=Symbol("internalAop");var R=Symbol("collection"),q=Symbol("components"),U=Symbol("createComponent"),B=Symbol("createInstance"),Z=Symbol("loader"),z=Symbol("injector"),H={},J=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];f(this,e),this[q]=Object.create(null),this[R]=new Q([new x,new G,new S,new L,new N,new F]),this[R].addPlugins(t.plugins),this[Z]=new P(this),this[z]=new b(this),t=this[R].onContainerInit(this,t),this.initConfig(t)}return l(e,[{key:"initConfig",value:function(e){e.loader&&this.setLoaderFunction(e.loader),this.addComponent(e.components||{})}},{key:"addComponent",value:function(e,t){if("object"!==("undefined"==typeof e?"undefined":c(e))){if(this.hasComponent(e))throw new Error(String(e)+" has been added!");this[q][e]=this[U].call(this,e,t)}else for(var n in e)this.addComponent(n,e[n])}},{key:"getComponent",value:function(e){var t=this;if(e instanceof Array)return Promise.all(e.map(function(e){return t.getComponent(e)}));var n=Object.create(null);if(!this.hasComponent(e))return e=String(e),Promise.reject(new Error("`"+e+"` has not been added to the Ioc"));var r=this.getComponentConfig(e);this.processConfig(e);try{n=this[Z].resolveDependentModules(r,n,r.argDeps)}catch(e){return Promise.reject(e)}return this[Z].loadModuleMap(n).then(function(){return t[B](e)})}},{key:"hasComponent",value:function(e){return!!this[q][e]}},{key:"getComponentConfig",value:function(e){return e?this[q][e]:this[q]}},{key:"setLoaderFunction",value:function(e){this[Z].setLoaderFunction(e)}},{key:"dispose",value:function(){this[R].onContainerDispose(this),this[z].dispose(),this[q]=null}},{key:"addPlugins",value:function(e,t){this[R].addPlugins(e,t)}},{key:"getPlugins",value:function(){return this[R].getPlugins()}},{key:"removePlugin",value:function(e){return this[R].removePlugin(e)}},{key:"processConfig",value:function(e){var t=this.getComponentConfig(e);if(t=this[R].onGetComponent(this,e,t),this[q][e]=t,!t.argDeps)for(var n=t.argDeps=[],r=t.args,o=r.length-1;o>-1;--o)m.hasRef(r[o])&&n.push(r[o].$ref)}},{key:U,value:function(e,t){t=this[R].onAddComponent(this,e,t);var n=p({id:e,args:[],properties:{},argDeps:null,propDeps:null,setterDeps:null,scope:"transient",creator:null,module:void 0,isFactory:!1,auto:!1,instance:null},t);return"function"==typeof n.creator&&this[Z].wrapCreator(n),n}},{key:B,value:function(e){var t=this;return this[R].beforeCreateInstance(this,e).then(function(n){if(n===H){var r=t.hasComponent(e)?t.getComponentConfig(e):null;return t[z].createInstance(r)}return n}).then(function(n){return t[R].afterCreateInstance(t,e,n)})}}]),e}(),K=Symbol("plugins"),Q=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0];f(this,e),this[K]=t}return l(e,[{key:"onContainerInit",value:function(e,t){return this[K].reduce(function(t,n){return n.onContainerInit(e,t)},t)}},{key:"onAddComponent",value:function(e,t,n){return this[K].reduce(function(n,r){return r.onAddComponent(e,t,n)},n)}},{key:"onGetComponent",value:function(e,t,n){return this[K].reduce(function(n,r){return r.onGetComponent(e,t,n)},n)}},{key:"beforeCreateInstance",value:function(e,t){return this[K].reduce(function(n,r){return n.then(function(n){n=n===H?void 0:n;var o=r.beforeCreateInstance(e,t,n);return m.isPromise(o)?o:Promise.resolve(H)})},Promise.resolve(H))}},{key:"afterCreateInstance",value:function(e,t,n){return this[K].reduce(function(n,r){return n.then(function(n){var o=r.afterCreateInstance(e,t,n);return m.isPromise(o)?o:Promise.resolve(n)})},Promise.resolve(n))}},{key:"onContainerDispose",value:function(e){this[K].forEach(function(t){return t.onContainerDispose(e)})}},{key:"addPlugins",value:function(){var e,t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0],n=arguments.length<=1||void 0===arguments[1]?this[K].length:arguments[1];(e=this[K]).splice.apply(e,[n,0].concat(y(t)))}},{key:"getPlugins",value:function(){return this[K].slice(0)}},{key:"removePlugin",value:function(e){return"number"!=typeof e&&(e=this[K].indexOf(e),e=e===-1?this[K].length:e),!!this[K].splice(e,1).length}}]),e}();e.IoC=J,e.BasePlugin=w});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./bundle": 1,
		"./bundle.js": 1
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 4;


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _List = __webpack_require__(7);
	
	var _List2 = _interopRequireDefault(_List);
	
	var _Loader = __webpack_require__(8);
	
	var _Loader2 = _interopRequireDefault(_Loader);
	
	var _ThirdLoader = __webpack_require__(9);
	
	var _ThirdLoader2 = _interopRequireDefault(_ThirdLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    components: {
	        listA: {
	            creator: _List2.default,
	            args: [document.getElementById('a'), { $ref: 'loader' }]
	        },
	        listB: {
	            creator: _List2.default,
	            args: [document.getElementById('b'), { $ref: 'thirdLoader' }]
	        },
	        loader: {
	            creator: _Loader2.default,
	            args: ['list.json']
	        },
	        thirdLoader: {
	            creator: _ThirdLoader2.default
	        }
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// List.js
	
	var List = function () {
	    function List(container, loader) {
	        _classCallCheck(this, List);
	
	        this.container = container;
	        this.loader = loader;
	    }
	
	    _createClass(List, [{
	        key: "render",
	        value: function () {
	            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                _context.next = 2;
	                                return this.loader.load();
	
	                            case 2:
	                                this.container.textContent = _context.sent;
	
	                            case 3:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));
	
	            function render() {
	                return _ref.apply(this, arguments);
	            }
	
	            return render;
	        }()
	    }]);
	
	    return List;
	}();
	
	exports.default = List;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Loader = function () {
	    function Loader(url) {
	        _classCallCheck(this, Loader);
	
	        this.url = url;
	    }
	
	    _createClass(Loader, [{
	        key: "load",
	        value: function () {
	            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	                var result;
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                _context.next = 2;
	                                return fetch(this.url);
	
	                            case 2:
	                                result = _context.sent;
	                                return _context.abrupt("return", result.json());
	
	                            case 4:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));
	
	            function load() {
	                return _ref.apply(this, arguments);
	            }
	
	            return load;
	        }()
	    }]);
	
	    return Loader;
	}();
	
	exports.default = Loader;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _sdk = __webpack_require__(10);
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ThirdServiceLoader = function () {
	    function ThirdServiceLoader() {
	        _classCallCheck(this, ThirdServiceLoader);
	    }
	
	    _createClass(ThirdServiceLoader, [{
	        key: 'load',
	        value: function () {
	            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                return _context.abrupt('return', (0, _sdk.request)());
	
	                            case 1:
	                            case 'end':
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));
	
	            function load() {
	                return _ref.apply(this, arguments);
	            }
	
	            return load;
	        }()
	    }]);
	
	    return ThirdServiceLoader;
	}();
	
	exports.default = ThirdServiceLoader;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.request = request;
	function request() {
	    return Promise.resolve('thirdInfo1,thirdInfo2,thirdInfo3');
	}

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
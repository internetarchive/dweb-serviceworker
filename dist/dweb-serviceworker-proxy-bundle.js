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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./dweb-serviceworker-proxy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Errors.js":
/*!*******************!*\
  !*** ./Errors.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("errors = {};\n\n\n// Use this when the code logic has been broken - e.g. something is called with an undefined parameter, its preferable to console.assert\n// Typically this is an error, that should have been caught higher up.\nclass CodingError extends Error {\n    constructor(message) {\n        super(message || \"Coding Error\");\n        this.name = \"CodingError\"\n    }\n}\nerrors.CodingError = CodingError;\n\n/*\n// These are equivalent of python exceptions, will log and raise alert in most cases - exceptions aren't caught\nclass ToBeImplementedError extends Error {\n    constructor(message) {\n        super(\"To be implemented: \" + message);\n        this.name = \"ToBeImplementedError\"\n    }\n}\nerrors.ToBeImplementedError = ToBeImplementedError;\n*/\n\nclass TransportError extends Error {\n    constructor(message) {\n        super(message || \"Transport failure\");\n        this.name = \"TransportError\"\n    }\n}\nerrors.TransportError = TransportError;\n\n/*---- Below here are errors copied from previous Dweb-Transport and not currently used */\n/*\nclass ObsoleteError extends Error {\n    constructor(message) {\n        super(\"Obsolete: \" + message);\n        this.name = \"ObsoleteError\"\n    }\n}\nerrors.ObsoleteError = ObsoleteError;\n\n// Use this when the logic of encryption wont let you do something, typically something higher should have stopped you trying.\n// Examples include signing something when you only have a public key.\nclass EncryptionError extends Error {\n    constructor(message) {\n        super(message || \"Encryption Error\");\n        this.name = \"EncryptionError\"\n    }\n}\nerrors.EncryptionError = EncryptionError;\n\n// Use this something that should have been signed isn't - this is externally signed, i.e. a data rather than coding error\nclass SigningError extends Error {\n    constructor(message) {\n        super(message || \"Signing Error\");\n        this.name = \"SigningError\"\n    }\n}\nerrors.SigningError = SigningError;\n\nclass ForbiddenError extends Error {\n    constructor(message) {\n        super(message || \"Forbidden failure\");\n        this.name = \"ForbiddenError\"\n    }\n}\nerrors.ForbiddenError = ForbiddenError;\n\nclass AuthenticationError extends Error {\n    constructor(message) {\n        super(message || \"Authentication failure\");\n        this.name = \"AuthenticationError\"\n    }\n}\nerrors.AuthenticationError = AuthenticationError;\n\nclass IntentionallyUnimplementedError extends Error {\n    constructor(message) {\n        super(message || \"Intentionally Unimplemented Function\");\n        this.name = \"IntentionallyUnimplementedError\"\n    }\n}\nerrors.IntentionallyUnimplementedError = IntentionallyUnimplementedError;\n\nclass DecryptionFailError extends Error {\n    constructor(message) {\n        super(message || \"Decryption Failed\");\n        this.name = \"DecryptionFailError\"\n    }\n}\nerrors.DecryptionFailError = DecryptionFailError;\n\nclass SecurityWarning extends Error {\n    constructor(message) {\n        super(message || \"Security Warning\");\n        this.name = \"SecurityWarning\"\n    }\n}\nerrors.SecurityWarning = SecurityWarning;\n\nclass ResolutionError extends Error {\n    constructor(message) {\n        super(message || \"Resolution failure\");\n        this.name = \"ResolutionError\"\n    }\n}\nerrors.ResolutionError = ResolutionError;\n*/\nexports = module.exports = errors;\n\n\n//# sourceURL=webpack:///./Errors.js?");

/***/ }),

/***/ "./TransportsProxy.js":
/*!****************************!*\
  !*** ./TransportsProxy.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\nThis is a proxy that connects to a Service Worker running Transports.\nPart of the intention is to reduce the amount of code loaded for each page, and part is to keep webtorrent, IPFS running in background\nfor comprehensible service worker messaging example See https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/post-message/service-worker.js\nwhere much of this code came from\n */\nconst errors = __webpack_require__(/*! ./Errors */ \"./Errors.js\");\nconst utils = __webpack_require__(/*! ./utils */ \"./utils.js\");\n//const stream = require('readable-stream');    // Needed for createReadStream which is commented out for now\n\nclass TransportsProxy {\n    constructor(options, verbose) {\n        if (verbose) console.log(\"Transports(%o)\", options);\n    }\n\n    static async p_registerServiceWorker() {\n        /* Register a serice worker, normally called via p_connect */\n        console.log(\"Registering Service Worker\");\n        if ('serviceWorker' in navigator) {\n\n            await navigator.serviceWorker.register(window.location.origin+'/dweb-serviceworker-bundle.js');\n            console.log('-> Registered the service worker successfully');\n        } else {\n            console.error(\"Unable to register service worker as not in 'navigator'\");\n        }\n        this.refreshstatuses(await this.p_statuses());\n    }\n    static resolveNamesWith() {\n        console.log(\"Trying to register Domain with a TransportsProxy, it should have registered in ServiceWorker already so ignoring\");\n    }\n\n    static _p_proxy(command, args) {\n        // This wraps the message posting/response in a promise, which will resolve if the response doesn't\n        // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call\n        // controller.postMessage() and set up the onmessage handler independently of a promise, but this is\n        // a convenient wrapper.\n        return new Promise(function (resolve, reject) {\n            var messageChannel = new MessageChannel();\n            messageChannel.port1.onmessage = function (event) {\n                if (event.data.error) {\n                    console.log(\"Client received error\", event.data.error);\n                    reject(new errors.TransportError(event.data.error));\n                } else {\n                    console.log(\"Client received response\")\n                    resolve(event.data);\n                }\n            };\n\n            // This sends the message data as well as transferring messageChannel.port2 to the service worker.\n            // The service worker can then use the transferred port to reply via postMessage(), which\n            // will in turn trigger the onmessage handler on messageChannel.port1.\n            // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage\n            navigator.serviceWorker.controller.postMessage(\n                {command, args},\n                [messageChannel.port2]);\n        });\n    }\n\n    static async p_statuses() {\n        return await this._p_proxy(\"p_statuses\", []);\n    }\n    static async p_connectedNames() {\n        return await this._p_proxy(\"p_connectedNames\", []);\n    }\n    static async p_connectedNamesParm() {\n        return await this._p_proxy(\"p_connectedNamesParm\", []);\n    }\n    static async p_rawfetch(urls, opts) {\n        return await this._p_proxy(\"p_rawfetch\", [urls, opts]);\n    }\n    static async p_rawstore(data, opts) {\n        return await this._p_proxy(\"p_rawstore\", [data, opts]);\n    }\n    static async p_rawlist(urls, opts) {\n        return await this._p_proxy(\"p_rawlist\", [urls, opts]);\n    }\n    static async p_rawadd(urls, sig, opts) {\n        return await this._p_proxy(\"p_rawadd\", [urls, sig, opts]);\n    }\n    static async p_get(urls, keys, opts) {\n        return await this._p_proxy(\"p_get\", [urls, keys, opts]);\n    }\n    static async p_set(urls, keyvalues, value, opts) {\n        return await this._p_proxy(\"p_set\", [urls, keyvalues, value, opts]);\n    }\n    static async p_delete(urls, keys, opts) {\n        return await this._p_proxy(\"p_delete\", [urls, keys, opts]);\n    }\n    static async p_resolveNames(urls) {\n        return await this._p_proxy(\"p_resolveNames\", [urls]);\n    }\n    static async p_keys(urls, opts) {\n        return await this._p_proxy(\"p_keys\", [urls, opts]);\n    }\n    static async p_getall(urls, opts) {\n        return await this._p_proxy(\"p_getall\", [urls, opts]);\n    }\n    static async p_newdatabase(pubkey, opts) {\n        return await this._p_proxy(\"p_newdatabase\", [pubkey, opts]);\n    }\n    static async p_newtable(pubkey, table, opts) {\n        return await this._p_proxy(\"p_newtable\", [pubkey, table, opts]);\n    }\n    static async p_httpfetchurl(urls) {\n        return await this._p_proxy(\"p_httpfetchurl\", [urls]);\n    }\n    static async p_urlsFrom(url) {\n        return await this._p_proxy(\"p_urlsFrom\", [url]);\n    }\n    static async p_urlsValidFor(urls, func, options) {\n        return await this._p_proxy(\"p_urlsValidFor\", [urls, func, options]);\n    }\n    /*\n    static listmonitor(urls, cb) // TODO-SW -- cb isnt going to work, or maybe it can via message passing\n    static async p_newlisturls(cl, opts)  // TODO-SW -- will need to extract info from cl\n    */\n\n    static async refreshstatuses(statuses) {\n        /* Refresh display of statuses:\n        statuses    [ {name, status}* ]\n         */\n        statuses.map(s => this.refreshstatus(s.name, s.status));\n    }\n    static async refreshstatus(name, status) {\n        /* Update the status pointed to by options.statuselement, changes its class to one of statusclasses\n        name:   String matching the .name of the Transport\n        status: Integer representing the status 0..4\n         */\n        let statuselement = TransportsProxy.options.statuselement; // May be undefined\n        if (statuselement) {\n            let el = Array.prototype.slice.call(statuselement.getElementsByTagName(\"LI\")).find((el) => el.getAttribute(\"name\") === name);\n            if (!el) {\n                el = utils.createElement(\"LI\",\n                    {onclick: \"this.source.togglePaused(DwebTransports.refreshstatus);\", name}, //TODO-SW add toggle to UI and message>SW>Transports\n                    name);\n                statuselement.appendChild(el);\n            }\n            let statusclasses = [\"transportstatus0\",\"transportstatus1\",\"transportstatus2\",\"transportstatus3\",\"transportstatus4\"];\n            el.classList.remove(...statusclasses);\n            el.classList.add(statusclasses[status]);\n        }\n\n    }\n\n    static async p_connect(options, verbose) {\n        /*\n        Connect to the transports,\n        options = { defaulttransports: [\"IPFS\"], statuselement: el, http: {}, ipfs: {} }\n        Chain is typically: archive.html.main > TP.p_connect > TP.p_registerServiceWorker > SW.activate ...\n        */\n        this.options = options; // Save for later - esp statuselement\n        this.p_registerServiceWorker();\n        navigator.serviceWorker.addEventListener('message', function(event) {\n            if (event.data.command === \"status\") {\n                TransportsProxy.refreshstatus(event.data.name, event.data.status);\n            } else {\n                console.log(\"Client received uninterpretable SW message\",event.data);\n            }\n\n        });\n    }\n\n/*\n        //This is hard! Have to return a stream immediately, but all possible ways to get it are async.\n\n        //Doesnt work on WebTorrent as is, because it returns a Browser ReadableStream, and rendermedia wants a node ReadStream\n        //doesnt matter for now since with Service Worker, best to go direct to <video src = '/magnet/...'>\n        //Revisit this for IPFS streams when they work.\n\n    static async p_f_createReadStream(urls, options={}) {     // TODO need to tell proxy to return a url\n        let wanturl = options.wanturl; // Save for interpretation below\n        options.wanturl = true; // Always set wanturl for call\n        let verbose = options[\"verbose\"];\n        let url = await this._p_proxy(\"p_f_createReadStream\", [urls, options]); // Note will be a URL structure\n        if (wanturl) {\n            return url;\n        } else {\n            let self = this;\n            console.log(\"XXX@TP.164 url=\",url)\n            return function(opts) { return self.createReadStream(url, opts, verbose); };\n        }\n    }\n\n    static createReadStream(httpurl, opts={}, verbose) {\n        //\n\n        console.log(\"XXX@TPcrs httpurl=\",httpurl, opts)\n        const through = new stream.PassThrough();\n        let headers = new Headers();\n        if (opts.start || opts.end) headers.append(\"range\", `bytes=${opts.start || 0}-${opts.end || \"\"}`);\n        let init = {    //https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch\n            method: 'GET',\n            headers: headers,\n            mode: 'cors',\n            cache: 'default',\n            redirect: 'follow',  // Chrome defaults to manual\n            keepalive: true    // Keep alive - mostly we'll be going back to same places a lot\n        };\n        httpurl = (typeof(httpurl) === \"string\" ? httpurl : httpurl.href).replace('magnet:',`${window.origin}/magnet/`) // Relative to root of this window\n        fetch(new Request(httpurl, init))\n            .then((resp) => {\n                console.log(resp);\n                resp.body.pipeThrough(through);  // This might not be correct\n                //resp.socket.pipe(through)\n            });\n        return through;\n    }\n    */\n}\nTransportsProxy.type = \"ServiceWorker\";\nexports = module.exports = TransportsProxy;\n\n\n//# sourceURL=webpack:///./TransportsProxy.js?");

/***/ }),

/***/ "./dweb-serviceworker-proxy.js":
/*!*************************************!*\
  !*** ./dweb-serviceworker-proxy.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const DwebTransports = __webpack_require__(/*! ./TransportsProxy */ \"./TransportsProxy.js\"); // Use proxy\nif (typeof window !== \"undefined\") { window.DwebTransports = DwebTransports; }\n//exports = module.exports = DwebTransports; // Not exporting as doesnt make sense to \"require\" this file\n\n\n//# sourceURL=webpack:///./dweb-serviceworker-proxy.js?");

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Keep this light, ideally dont put anything needing a \"require\" in here\nutils = {}; //utility functions\n\n//Parts of this file (consolearr, and createElement) are duplicated in dweb-transport; dweb-transports; dweb-serviceworker and dweb-objects repo\n\nutils.createElement = function(tag, attrs, children) {        // Note arguments is set to tag, attrs, child1, child2 etc\n    // Note identical version in dweb-transport/js/utils.js and dweb-transports/utils.js and dweb-objects/utils.js\n    var element = document.createElement(tag);\n    for (let name in attrs) {\n        let attrname = (name.toLowerCase() === \"classname\" ? \"class\" : name);\n        if (name === \"dangerouslySetInnerHTML\") {\n            element.innerHTML = attrs[name][\"__html\"];\n            delete attrs.dangerouslySetInnerHTML;\n        }\n        if (attrs.hasOwnProperty(name)) {\n            let value = attrs[name];\n            if (value === true) {\n                element.setAttribute(attrname, name);\n            } else if (typeof value === \"object\" && !Array.isArray(value)) { // e.g. style: {{fontSize: \"124px\"}}\n                if ([\"style\"].includes(attrname)) {\n                    for (let k in value) {\n                        element[attrname][k] = value[k];\n                    }\n                } else {\n                    // Assume we are really trying to set the value to an object, allow it\n                    element[attrname] = value;  // Wont let us use setAttribute(attrname, value) unclear if because unknow attribute or object\n                }\n            } else if (value !== false && value != null) {\n                element.setAttribute(attrname, value.toString());\n            }\n        }\n    }\n    for (let i = 2; i < arguments.length; i++) { // Everything after attrs\n        let child = arguments[i];\n        if (!child) {\n        } else if (Array.isArray(child)) {\n            child.map((c) => element.appendChild(c.nodeType == null ?\n                document.createTextNode(c.toString()) : c))\n        }\n        else {\n            element.appendChild(\n                child.nodeType == null ?\n                    document.createTextNode(child.toString()) : child);\n        }\n    }\n    return element;\n}\n\n\nutils.optsFromRange = function(str) {\n    // Loosely based on npm range-parser , which requires the file size\n    let index = str.indexOf('=');\n    if (index === -1) {\n        return {}\n    }\n    // split the range string\n    let arr = str.slice(index + 1).split(',');\n    // check ranges type\n    if (str.slice(0, index) !== \"bytes\") throw new Error(\"Only byte ranges supported\");\n    // parse only first range (range-parser loops over all of them)\n    let range = arr[0].split('-');\n    let start = parseInt(range[0], 10) || 0;\n    let end = parseInt(range[1], 10) || undefined;\n    return {start, end};\n}\n\nexports = module.exports = utils;\n\n\n//# sourceURL=webpack:///./utils.js?");

/***/ })

/******/ });
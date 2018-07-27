# dweb-serviceworker 
Library for Decentralized Web over a Service Worker - builds on dweb-transports.

## Background
This library is part of a general project at the Internet Archive (archive.org) 
to support the decentralized web.  

### Goals
* to allow an app to use a Service Worker to access the Decentralized Web

### Node Installation
* Clone this repo. 
`"@internetarchive/dweb-transports": "latest",`
`"@internetarchive/dweb-objects": "latest",`

and until this is in NPM
`"@internetarchive/dweb-serviceworker": "git+https://git@github.com/internetarchive/dweb-serviceworker.git",`
to your package.json file in the dependencies section. 
* `npm install @internetarchive/dweb-serviceworker`  will install the dependencies including IPFS & WebTorrent and dweb-transports

In this order.
```
const DwebTransports = require('dweb-serviceworker-proxy') #adds the transports
const DwebObjects = require('@internetarchive/dweb-objects;) #adds the object library if needed
```

* Then see usage API in API.md

### Installation and usage in the Browser

* Install npm & node
* TODO - replace instruction above (and in other repos) with download link
* Clone this repo and cd to it.
* `npm build` will create dist/dweb_serviceworker-proxy-bundle.js
* Add to your `<HEAD>`

```
<SCRIPT type="text/javascript" src="dweb-serviceworker-proxy-bundle.js"></SCRIPT>
```

See the examples in the [`dweb-transport` repo](https://github.com/internetarchive/dweb-transport) for some example code. 

See [API.md](./API.md) and dweb-transports API.md (TODO need link)for the detailed API.

## See related:

* [Archive.org](http://dweb.archive.org/details) bootstrap into the Archive's page
* [Examples](http://dweb.me/examples) examples

### Repos:
* *dweb-transports:* Common API to underlying transports (http, webtorrent, ipfs, yjs)
* *dweb-objects:* Object model for Dweb inc Lists, Authentication, Key/Value, Naming
* *dweb-serviceworker:* Run Transports in ServiceWorker (experimental)
* *dweb-archive:* Decentralized Archive webpage and bootstrapping 
* *dweb-transport:* Original Repo, still includes examples but being split into smaller repos

## Overview
The Service Worker bundle acts as a proxy to access the standard Transports Library running in a Service Worker. 

The simplified flow is: 
At launch:
* Webpage 
    * loads `serviceworker-proxy-bundle.js` which installs TransportProxy class at DwebTransports in global context
    * calls `DwebTransports.p_connect`
* `TransportsProxy.p_connect`
    * launches ServiceWorker
    * installs eventListener for `status`
* ServiceWorker
    * fetches and installs code (once)
    * connects to transports e.g. IPFS, HTTP, WebTorrent
    * sends `status` messages to `TransportsProxy`
* `TransportProxy` interacts with UI.

To fetch a webpage by single URL or name
* Webpage does a fetch of e.g. `https://myhost/arc/archive.org/details/foo`
* URL intercepted by ServiceWorker routing in dweb-serviceworker.js
* Name resolution and URL fetching completed by ServiceWorker
* File returned to fetch, looking like a normal HTTPS response

To fetch a webpage by multiple, alternate URLs
* Webpage calls DwebTransports.p_fetch([urls]) and gets back a response
* TransportProxy.p_fetch passes message to Service Worker 
* ServiceWorker responds with file.
* Promise resolves in same way as non-SW call to Transports.p_fetch

## Implementation
The ServiceWorker is implemented as 4 (TODO check) key files
* dweb-serviceworker-proxy.js - loads TransportsProxy in a browser
* TransportsProxy.js - implements a class that looks like Transports class from dweb-transports
* dweb-serviceworker.js - runs in the ServiceWorker, implements the routing of URLs, and talks to Transports class from dweb-transports and Domain class from dweb-objects

The dweb-objects repo is (or should be) fully compatible with the ServiceWorker i.e.
if TransportsProxy is loaded with `const DwebTransports = require('dweb-serviceworker-proxy')`
then the rest of the code should work as normal.

#### Current exceptions
The following functionality is not yet implemented.
* From DwebTransports: listmonitor and monitor which rely on callbacks (see communications below)
* From dweb-objects: CommonList.listmonitor and KeyValueTable.monitor which use the above
* From DwebTransports: p_f_createReadStream and createReadStream 
    * In IPFS these are not yet implemented (waiting on byte selection in files.cat to land)
    * In WebTorrent it requires WebRTC, and the HTTP fallback is more efficient to access directly
* From Transport and CommonList: p_newlisturls - just needs implementing (TODO easy)

## Communicating with Service Worker

4 ways to communicate with a Service Worker are exposed and tested

#### Fetch
Any fetch is intercepted by the Service Worker which responds with a standard HTTP Response

#### Call and response
* A call to TransportsProxy is passed as a message to the SW
* The SW calls the method with that name on Transports.
* The result of the method is sent back as a message or an error
* TransportsProxy returns to the caller

#### Unsolicited messages from the SW
* The SW can send a message to one client, or all of them
* An eventListener on TransportsProxy catches the message and interprets event.data = {command, ...}

#### Callbacks TODO-SW
* TODO this is not yet implemented
* The call to TransportProxy includes a callback
* SW calls the function with its own callback which includes the Message port
* The SW callback relays to the Message Port
* TP will send each response message to the callback
* The effect should be the same for the caller as if calling the Transports method directly with a callback


## API

### TransportsProxy
The API is intended to match *exactly* 
the API to Transports.js in dweb-transports (TODO need link) 
for all static async functions (which cover all functionality). 

##### static async p_registerServiceWorker() {
Register a serice worker, normally called via p_connect

##### resolveNamesWith(cb)
Is dummied out, to intercept when Domain tries to add itself to the Transports

##### static _p_proxy(command, args) {
This wraps the message posting/response in a promise, which will resolve if the response doesn't
contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
controller.postMessage() and set up the onmessage handler independently of a promise, but this is
a convenient wrapper.

Each method of Transports has a method in TransportsProxy that calls _p_proxy

##### static async refreshstatuses(statuses)
Refresh display of statuses (see refreshstatus)
```
statuses    [ {name, status}* ]
```

##### static async refreshstatus(name, status)
Update the status pointed to by options.statuselement, changes its class to one of statusclasses
```
name:   String matching the .name of the Transport
status: Integer representing the status 0..4
```
##### static async p_connect(options, verbose)
Connect to the transports,
Chain is typically: archive.html.main > TP.p_connect > TP.p_registerServiceWorker > SW.activate ...
```
options = { defaulttransports: ["IPFS"], statuselement: el, http: {}, ipfs: {} }
    statuselement   HTML Element in which to build <li>'s for the status.
    See dweb-transports/p_connect for definition of other options
```

## dweb-serviceworker-boot.js
When included in a HTML file, will
* Register the serviceworker - which loads it from the remote server if required
* Check for a addr=  search parameter and otherwise use its own URL
* Redirect to that url (or addr) which will be interpreted by the serviceworker.

## dweb-boot-serviceworker.html
This file is intended as a drop-in replacement for dweb-archive/bootloader.html.

Loads dweb-serviceworker-boot.js and then redirects to the URL,

This file is intended to be either:
a) loaded by nginx which will then redirect to the original URL
b) load dweb-boot-serviceworker.html?addr=redirectable URL

## dweb-serviceworker-proxy.js
Loads TransportsProxy and sets to global variable "DwebObjects", intended so that dweb-serviceworker-proxy-bundle.js is equivalent to dweb-transports.js

## dweb-serviceworker.js
Top level file for dweb-serviceworker-bundle
Implements several means of communication (see README.md) and intended to work closely with TransportsProxy.js

Its structure is modeled on standard examples, note that because IPFS (and other transports) needs to be running, and can be (arbitrarily) stopped by the browser, the "activate" step
and the messaging will check its running.

It handles fetch requests, and implements a set of rules, currently documented in dweb-transport/URL-forward.md (TODO check this file exists, or replace with new location)

It is loaded by TransportsProxy, TODO this should probably be parameterised through options, so that both calls from dweb-serviceworker-proxy.js amd direct calls to TransportsProxy can set it.

TODO - Working through TransportsProxy here, then write up bootstrapping esp URL rewrite rules



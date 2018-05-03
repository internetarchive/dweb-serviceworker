# dweb-serviceworker 
Library for Decentralized Web over a Service Worker - builds on dweb-transports.

## Background
This library is part of a general project at the Internet Archive (archive.org) 
to support the decentralized web.  

### Goals
* to allow an app to use a Service Worker to access the Decentralized Web

### Node Installation
* Clone this repo. 
* Until this is in npm, add the lines
`"dweb-transports": "git+https://git@github.com/internetarchive/dweb-transports.git",`
`"dweb-objects": "git+https://git@github.com/internetarchive/dweb-objects.git",`
`"dweb-serviceworker": "git+https://git@github.com/internetarchive/dweb-serviceworker.git",`
to your package.json file in the dependencies section. 
* `npm install dweb-serviceworker`  will install the dependencies including IPFS & WebTorrent and dweb-transports

In this order.
```
const DwebTransports = require('dweb-serviceworker-proxy') #adds the transports
const DwebObjects = require('dweb-objects;) #adds the object library if needed
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

##See related:

* [Archive.org](http://dweb.archive.org/details) bootstrap into the Archive's page
* [Examples](http://dweb.me/examples) examples

###Repos:
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

## TODO document bootstrapping
* dweb-boot-serviceworker.html
* dweb-serviceworker-boot.js

##Communicating with Service Worker

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

###TransportsProxy
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

TODO - Working through TransportsProxy here



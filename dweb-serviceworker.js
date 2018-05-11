/* global self, Response */
/*
Top level file for dweb-serviceworker-bundle
Implements several means of communication (see README.md) and intended to work closely with TransportsProxy.js
 */

'use strict';

var DwebTransports = require('dweb-transports'); // Handles multiple transports
const Domain = require('dweb-objects/Domain'); // Must be after DwebTransports, plugs into DwebTransports to resolve names
const Leaf = Domain.clsLeaf;
const errors = require('./Errors');
const utils = require('./utils');


self.addEventListener('install', (event) => {
    console.log('service-worker installing');
    event.waitUntil(self.skipWaiting());
    console.log('service-worker clients.skipWaiting completed');
});

async function p_refreshstatus(t) {
    let clients = await self.clients.matchAll();
    return await Promise.all(clients.map((client) => client.postMessage({command: "status", name: t.name, status: t.status})));
}

self.addEventListener('activate', (event) => {
    console.log('service-worker activating');
    event.waitUntil(self.clients.claim());
    console.log('service-worker clients.claim completed');
    console.log("Connecting to decentralized transports");
    //event.waitUntil(DwebTransports.p_connect({transports: ["HTTP","WEBTORRENT"], statuscb: p_refreshstatus})); //{transports: searchparams.getAll("transport")}; statuselement: document.getElementById("statuselement")
    event.waitUntil(DwebTransports.p_connect({statuscb: p_refreshstatus})); //{transports: searchparams.getAll("transport")}; statuselement: document.getElementById("statuselement")
    console.log('service-worker p_connect complete');
});

//TODO-SW make sure can bootstrap off of basic disk

self.addEventListener('fetch', (event) => {
    // self.location.origin is e.g. "http://localhost:8080" and URL should always match this or Service Worker wont catch it
    //Called each time client tries to load a URL in the domain
    let opts = {};
    let range = { start: 0 };
    let rangeHeader = event.request.headers.get('range');
    if (rangeHeader) {
        range = utils.optsFromRange(rangeHeader);   // Really wants size, but we don't know that.
    }
    let url = new URL(event.request.url);
    let verbose = url.searchParams.get("verbose") || false;
    console.log("Service Worker called with url=",url.href);
    if (url.pathname.startsWith('/ping')) {                 // Just for testing
        event.respondWith(p_ping(`Ping: ${url.href}`));
    //} else if (url.pathname.startsWith('/test')) {          // Feel free to change this
    //    event.respondWith(p_redirect("./temp.html"));
    } else if (url.hostname.startsWith("dweb.") && (url.hostname !== "dweb.me")) {          // https://dweb.archive.org/details/foo -> dweb.archive.org/arc/archive.org/details/foo
        url.pathname = `/arc/${url.hostname.substring(5)}${url.pathname}`;
        event.respondWith(p_redirect(url.href));
    } else if ( url.pathname.startsWith("/archive.org")) {  // https://localhost:4244/archive.org/details/foo -> /arc/archive.org/details/foo
        url.pathname = `/arc${url.pathname}`;
        event.respondWith(p_redirect(url.href));
    } else if ((self.location.origin === "http://localhost:8080") && (url.hostname === "dweb.me") && url.pathname.startsWith("/examples/")) {   // dweb.me/examples/foo -> localhost:8080/foo //TODO-SW check when know where http-server running
        event.respondWith(p_redirect(`${self.location.origin}/${url.pathname.slice(10)}`));
    } else if ( url.pathname.startsWith("/arc/")) {         // https://localhost:4244/arc/archive.org/details/foo -> archive.html (from resolution)
        event.respondWith(p_responseFromName(url.pathname, url.search.slice(1), {verbose}));   // Skip initial "?" in search
    } else if (url.pathname.startsWith('/magnet/') || (url.protocol === "magnet:")) {
        event.respondWith(p_respondWebTorrent(`magnet:${url.pathname.replace('/magnet/', '')}${url.search}`, range, verbose));
    } else if ((url.pathname.startsWith('/ipfs')) && (url.hostname !== "ipfs.io")) {
        //TODO-SW implement ipfs catch
        //TODO-SW move https://ipfs.io check into TransportsIPFS so use one URL dweb:/ipfs of ipfs:/ipfs and tries IPFS & http://ipfs.io
        event.respondWith(p_respondFromDwebUrl(`ipfs:${url.pathname}`));
    }
    // The browser will now attempt to get it in the normal way
    else {
        return console.log("Out of scope trying from browser", url.href);
    }
});

async function p_ping(url, text) {
    const headers = {status: 200, statusText: 'OK', headers: {"Location": "FOO.html"}};
    return new Response(`${text || "Ping response to:"} ${url}`, headers)
}
async function p_redirect(newurl) {
    //TODO-SW maybe use the redirect status that doesnt change the URL in some cases
    console.log("Redirecting to", newurl);
    return new Response(undefined,  {status: 307, statusText: 'OK', headers: {"Location": newurl}})
}
async function p_respondFromDwebUrl(url) {
    let data = await DwebTransports.p_rawfetch(resolution.urls, {verbose});
    //TODO-SW one problem is that we dont know the mime type here
    return new Response(data, {status: 200, statusText: 'OK', headers: {}});
}
async function p_respondWebTorrent(url, opts, verbose) {
    let readablestream = await DwebTransports.webtorrent().p_createReadableStream(url, opts, verbose);
    return new Response(readablestream, {status: 200, statusText: 'OK', headers: {}});
}
async function p_responseFromName(name, search_supplied, {verbose=false}={}) {
    /* Retrieve a URL being smart about resolving domains etc */
    console.log("Name to lookup=",name);
    //document.write('<div id="statuselement"></div>');
    //TODO - connect at start
    try {
        const res = await Domain.p_rootResolve(name, {verbose});
        const resolution = res[0];
        const remainder = res[1];
        if (remainder && remainder.length) {
            // TODO make leaf clear about remainder - can specify to ignore it, or its a redirect (which would only work with one URL returned)
        }
        if (self.location.origin === "http://localhost:8080") {
            console.log(`XXXSW @100 rewriting ${resolution.urls} to localhost url`);
            //These are just while debugging, can uncomment while testing on localhost and dont have on dweb.me
            //resolution.urls = resolution.urls.map((u) => u.replace('https://dweb.me/examples/archive.html','http://localhost:8080/archive.html'))
            console.log(`XXXSW @130 res= ${resolution.urls}`);
        }
        let data = await DwebTransports.p_rawfetch(resolution.urls, {verbose});
        return new Response(data, {status: 200, statusText: 'OK', headers: {"Content-type": resolution.mimetype}});

    } catch(err) {
        console.error("Got error",err);
        throw(err);
    }
}

self.addEventListener('message', (event) => {
    /* This ia proxy for Transports
    event.command = p_rawfetch|....
     */
    console.log("SW handling event", event.data.command, event.data.args);
    let res;
    if (typeof DwebTransports[event.data.command] !== "function") {
        event.ports[0].postMessage({error: `No such command on DwebTransports: ${event.data.command}`});
    }
    if (typeof(DwebTransports[event.data.command]) === "function" ) {
        DwebTransports[event.data.command](...event.data.args)
        //.then((res) => { console.log("XXX@123 res=", res); return res; }) //  uncomment for debugging
            .then((res) => event.ports[0].postMessage(res))
            .catch((err) => event.ports[0].postMessage({error: err.message}));
        return false;
    } else {
        throw new errors.CodingError(`Command: ${event.data.command} not defined in Transports`);
    }
});

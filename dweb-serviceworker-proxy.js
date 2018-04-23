const DwebTransports = require('./TransportsProxy'); // Use proxy
if (typeof window !== "undefined") { window.DwebTransports = DwebTransports; }
//exports = module.exports = DwebTransports; // Not exporting as doesnt make sense to "require" this file

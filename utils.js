// Keep this light, ideally dont put anything needing a "require" in here
utils = {}; //utility functions

//Parts of this file (consolearr, and createElement) are duplicated in dweb-transport; dweb-transports; dweb-serviceworker and dweb-objects repo

utils.createElement = function(tag, attrs, children) {        // Note arguments is set to tag, attrs, child1, child2 etc
    // Note identical version in dweb-transport/js/utils.js and dweb-transports/utils.js and dweb-objects/utils.js
    var element = document.createElement(tag);
    for (let name in attrs) {
        let attrname = (name.toLowerCase() === "classname" ? "class" : name);
        if (name === "dangerouslySetInnerHTML") {
            element.innerHTML = attrs[name]["__html"];
            delete attrs.dangerouslySetInnerHTML;
        }
        if (attrs.hasOwnProperty(name)) {
            let value = attrs[name];
            if (value === true) {
                element.setAttribute(attrname, name);
            } else if (typeof value === "object" && !Array.isArray(value)) { // e.g. style: {{fontSize: "124px"}}
                if (["style"].includes(attrname)) {
                    for (let k in value) {
                        element[attrname][k] = value[k];
                    }
                } else {
                    // Assume we are really trying to set the value to an object, allow it
                    element[attrname] = value;  // Wont let us use setAttribute(attrname, value) unclear if because unknow attribute or object
                }
            } else if (value !== false && value != null) {
                element.setAttribute(attrname, value.toString());
            }
        }
    }
    for (let i = 2; i < arguments.length; i++) { // Everything after attrs
        let child = arguments[i];
        if (!child) {
        } else if (Array.isArray(child)) {
            child.map((c) => element.appendChild(c.nodeType == null ?
                document.createTextNode(c.toString()) : c))
        }
        else {
            element.appendChild(
                child.nodeType == null ?
                    document.createTextNode(child.toString()) : child);
        }
    }
    return element;
}


utils.optsFromRange = function(str) {
    // Loosely based on npm range-parser , which requires the file size
    let index = str.indexOf('=');
    if (index === -1) {
        return {}
    }
    // split the range string
    let arr = str.slice(index + 1).split(',');
    // check ranges type
    if (str.slice(0, index) !== "bytes") throw new Error("Only byte ranges supported");
    // parse only first range (range-parser loops over all of them)
    let range = arr[0].split('-');
    let start = parseInt(range[0], 10) || 0;
    let end = parseInt(range[1], 10) || undefined;
    return {start, end};
}

exports = module.exports = utils;

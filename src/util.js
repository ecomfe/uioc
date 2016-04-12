function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}

function addToSet(arr, el) {
    arr.indexOf(el) === -1 && arr.push(el);
}

function isObject(obj) {
    return obj !== null && obj !== undefined && Object.prototype.toString.call(obj) === '[object Object]';
}

function warn() {
    if (typeof console !== 'undefined') {
        Function.prototype.apply.call(console.warn, console, arguments);
    }
}

export default {
    hasOwn,
    addToSet,
    isObject,
    warn
}

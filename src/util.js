const OBJECT = Object.prototype.toString.call({});

function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}

function addToSet(arr, el) {
    arr.indexOf(el) === -1 && arr.push(el);
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === OBJECT;
}

function isPromise(obj) {
    return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

function warn() {
    if (typeof console !== 'undefined') {
        Function.prototype.apply.call(console.warn, console, arguments);
    }
}

function hasRef(obj) {
    return isObject(obj) && typeof obj.$ref === 'string';
}

export default {
    hasOwn,
    addToSet,
    isObject,
    isPromise,
    hasRef: hasRef,
    warn
}

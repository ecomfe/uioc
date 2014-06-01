void function (define) {
    define(function () {
        var nativeIndexOf = Array.prototype.indexOf;

        function hasOwnProperty(object, key) {
            return Object.prototype.hasOwnProperty.call(object, key)
        }

        function indexOf(arr, el) {
            if (typeof nativeIndexOf === 'function' && arr.indexOf === nativeIndexOf) {
                return arr.indexOf(el);
            }

            for (var i = 0, len = arr.length; i < len; ++i) {
                if (arr[i] === el) {
                    return i;
                }
            }

            return -1;
        }

        function contains(arr, el) {
            return indexOf(arr, el) > -1;
        }


        function addToSet(arr, el) {
            !contains(arr, el) && arr.push(el);
        }

        function constant(value) {
            return function () {
                return value
            }
        }

        function log() {
            if (typeof console !== 'undefined') {
                console.log.apply(console, arguments)
            }
        }

        function warn() {
            if (typeof console !== 'undefined') {
                console.warn.apply(console, arguments)
            }
        }

        function immediate(fn) {
            if (typeof setImmediate === 'function') {
                setImmediate.apply(null, arguments);
                return;
            }

            var args = [].slice.call(arguments, 1);
            setTimeout(function () {
                fn(args);
            }, 0)
        }

        function isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        }

        return {
            hasOwnProperty: hasOwnProperty,
            contains: contains,
            addToSet: addToSet,
//            bind: bind,
            isObject: isObject,
            setImmediate: immediate,
            log: log,
            warn: warn
        };
    });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
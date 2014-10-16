void function (define, undefined) {
    define(
        function () {
            var nativeIndexOf = Array.prototype.indexOf;
            var slice = Array.prototype.slice;
            var nativeBind = Function.prototype.bind;

            function hasOwnProperty(object, key) {
                return Object.prototype.hasOwnProperty.call(object, key);
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

            function warn() {
                if (typeof console !== 'undefined') {
                    console.warn.apply(console, arguments);
                }
            }

            function isObject(obj) {
                return obj !== null && obj !== undefined && Object.prototype.toString.call(obj) === '[object Object]';
            }

            function hasReference(obj) {
                return isObject(obj) && typeof obj.$ref === 'string';
            }

            function hasImport(obj) {
                return isObject(obj) && typeof obj.$import === 'string';
            }

            function bind(fn) {
                var args = slice.call(arguments, 1);
                if (typeof fn.bind === 'function' && fn.bind === nativeBind) {
                    return fn.bind.apply(fn, args);
                }

                return function () {
                    var scope = args.shift();
                    args.push.apply(args, arguments);
                    fn.apply(scope, args);
                };
            }

            function merge() {
                var ret = {};
                for (var i = 0, len = arguments.length; i < len; ++i) {
                    var arg = arguments[i];
                    for (var k in arg) {
                        ret[k] = arg[k];
                    }
                }

                return ret;
            }

            // 循环依赖错误
            function CircularError(message, component) {
                this.message = message;
                this.component = component;
            }

            CircularError.prototype = Error.prototype;

            CircularError.prototype.print = function () {
                warn(this.message);
            };

            return {
                CircularError: CircularError,
                hasOwn: hasOwnProperty,
                contains: contains,
                addToSet: addToSet,
                merge: merge,
                isObject: isObject,
                bind: bind,
                indexOf: indexOf,
                hasReference: hasReference,
                hasImport: hasImport,
                warn: warn
            };
        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
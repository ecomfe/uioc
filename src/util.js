void function (define) {
    define(
        function () {
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

            function warn() {
                if (typeof console !== 'undefined') {
                    console.warn.apply(console, arguments)
                }
            }

            function isObject(obj) {
                return Object.prototype.toString.call(obj) === '[object Object]';
            }

            function hasReference(obj) {
                return isObject(obj) && typeof obj.$ref === 'string';
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
                hasOwnProperty: hasOwnProperty,
                contains: contains,
                addToSet: addToSet,
                isObject: isObject,
                hasReference: hasReference,
                warn: warn
            };
        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
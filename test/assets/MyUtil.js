define(function () {

    var MyUtil = function () {

    };

    MyUtil.prototype.isArray = function (obj) {

        if (Array.isArray) {
            return Array.isArray(obj);
        }
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    MyUtil.prototype.isNumber = function () {
        //just a test fn
    };

    MyUtil.prototype.isFunction = function () {
        //just a test fn
    };

    MyUtil.prototype.isString = function () {

    };

    return MyUtil;
});
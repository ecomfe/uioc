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

    MyUtil.factoryCreator = function (a, b) {
        return {
            a: a,
            b: b
        }
    };

    MyUtil.creator = function (a, b) {
        this.a = a;
        this.b = b;
    };

    return MyUtil;
});
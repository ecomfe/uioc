define(function () {

    var B = function (name, c) {
        this.name = name;
        this.c = c;

        this.util = null;
    };

    B.prototype.useUtil = function () {

        var arr = [ 1, 2, 3 ];
        return this.util.isArray(arr);
    };

    return B;
});
define(function () {
    var A = function (b) {
        this.b = b;
    };

    A.prototype.hello = function () {
        return "Hello " + this.b.name;
    };

    return A;
});
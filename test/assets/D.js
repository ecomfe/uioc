define(function () {

    var D = function () {
        this.str = null;
        this.number = null;
        this.bool = null;
        this.nully = null;
        this.fromMethod = null;
        this.fromMethodArray = null;
    };

    D.prototype.bye = function () {
        return "Bye!";
    };

    D.prototype.setFromMethod = function (value) {
        this.fromMethod = value;
    };

    D.prototype.setFromMethodArray = function (arr) {
        this.fromMethodArray = arr;
    };

    return D;
});
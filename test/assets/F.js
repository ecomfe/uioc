define(function () {

    var F = function () {
        this.$ = null;
    };

    F.prototype.isNumber = function (number) {
        return this.$.isNumeric(number);
    };

    return F;
});
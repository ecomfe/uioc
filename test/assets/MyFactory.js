define(function () {

    var MyFactory = function () {

        this.defaultCode = 12345;
    };

    MyFactory.prototype.createNumber = function () {

        return this.defaultCode;
    };

    return MyFactory;
});
define(function () {

    var E = function (argsObj) {
        this.str = argsObj.str || null;
        this.number = argsObj.number | null;
        this.bool = argsObj.bool || null;
        this.nully = argsObj.nully || null;
        this.obj = argsObj.obj || null;
    };

    return E;
});
define(
    function (require) {
        function A(arg1, arg2) {
            this.arg1 = arg1;
            this.arg2 = arg2;
        }

        A.prototype.setImportListProp = function (importListProp) {
            this.importListProp = importListProp;
            this.isCalled = true;
        };

        return A;
    }
);
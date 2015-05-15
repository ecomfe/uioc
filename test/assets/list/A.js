define(
    function (require) {
        function A(listArg1, listArg2) {
            this.listArg1 = listArg1;
            this.listArg2 = listArg2;
        }

        A.prototype.setListProperty = function (listProperty) {
            this.listProperty = listProperty;
        };

        return A;
    }
);
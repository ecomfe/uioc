define(
    function (require) {
        function Nest(obj, f, f1) {
            this.obj = obj;
            this.f = f;
            this.f1 = f1;
        }

        Nest.prototype.setImportA = function (importA) {
            this.importA = importA;
        };

        Nest.prototype.setD = function (d) {
            this.d = d;
        };

        Nest.prototype.isNumber = function (v) {
            return this.f.isNumber(v);
        };

        return Nest;
    }
);
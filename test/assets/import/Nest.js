define(
    function (require) {
        function Nest(obj, f) {
            this.obj = obj;
            this.f = f;
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
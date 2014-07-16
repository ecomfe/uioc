/**
 * Created by exodia on 14-6-27.
 */
define(
    function () {
        function AutoInject(a, b) {
            this.a = a;
            this.b = b;
            this.e = null;
        }

        AutoInject.prototype.setC = function (c) {
            this.c = c;
        };

        AutoInject.prototype.setD = function (d) {
            this.d = d;
        };

        AutoInject.prototype.sete = function (e) {
            this.e = e;
        };

        AutoInject.prototype.settest = function () {

        };

        AutoInject.prototype.setd = function () {

        };

        return AutoInject;
    }
);
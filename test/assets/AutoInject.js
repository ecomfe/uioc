/**
 * Created by exodia on 14-6-27.
 */
define(
    function () {
        function AutoInject(a, b) {
            this.a = a;
            this.b = b;
        }

        AutoInject.prototype.setC = function (c) {
            this.c = c;
        };

        AutoInject.prototype.setD = function (d) {
            this.d = d;
        };

        return AutoInject;
    }
);
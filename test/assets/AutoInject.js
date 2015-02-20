/**
 * Created by exodia on 14-6-27.
 */
define(
    function () {
        function AutoInject(a, b) {
            this.a = a;
            this.b = b;
            this.e = null;
            this.setCCalledCount = 0;
        }

        AutoInject.prototype.setC = function (c) {
            this.c = c;
            ++this.setCCalledCount;
        };

        AutoInject.prototype.setD = function (d) {
            this.d = d;
        };

        AutoInject.prototype.sete = function (e) {
            this.e = e;
        };

        AutoInject.prototype.setMyFactory = function (obj) {
            this.myFactory = obj;
        };

        AutoInject.prototype.settest = function () {

        };

        AutoInject.prototype.setd = function () {

        };

        AutoInject.prototype.setUnRegisterComponent = function () {

        };

        return AutoInject;
    }
);
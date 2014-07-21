/**
 * Created by exodia on 14-6-27.
 */
define(
    function () {
        var AutoInject = require('AutoInject');

        function AutoInject1() {
            AutoInject.apply(this, arguments);
        }

        AutoInject1.prototype = new AutoInject();

        AutoInject1.prototype.setF = function (f) {
            this.f = f;
        };


        return AutoInject1;
    }
);
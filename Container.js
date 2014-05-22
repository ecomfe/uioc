void function (define) {
    define(['./IocContext', './util'], function (Context, util) {

        function Container(context) {
            if (!(this instanceof Container)) {
                return new Container(context);
            }

            this.context = context;
        }

        Container.prototype.createInstance = function (component) {
            if (!component) {
                return null;
            }


        };

        Container.prototype.dispose = function () {
        };

        return Container;

    });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
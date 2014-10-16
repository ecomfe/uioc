void function (define) {
    define(
        function (require) {
            var u = require('./util');

            function Container(context) {
                this.context = context;
                this.singletons = {};
            }

            Container.prototype.createInstance = function (component, cb) {
                if (!component) {
                    return cb(null);
                }

                var id = component.id;
                if (component.scope === 'singleton' && this.singletons.hasOwnProperty(id)) {
                    return cb(this.singletons[id]);
                }

                if (component.scope === 'static') {
                    return cb(component.creator);
                }

                var me = this;
                createArgs(this, component, function (args) {
                    var instance = component.creator.apply(null, args);
                    if (component.scope === 'singleton') {
                        me.singletons[id] = instance;
                    }
                    cb(instance);
                });
            };

            Container.prototype.dispose = function () {
                var singletons = this.singletons;
                for (var k in singletons) {
                    var instance = singletons[k];
                    instance && typeof instance.dispose === 'function' && instance.dispose();
                }

                this.singletons = null;
            };

            function createArgs(container, component, cb) {
                var argConfigs = component.args;
                var count = argConfigs.length;
                var args = Array(count);
                if (!count) {
                    return cb(args);
                }

                var done = function (index) {
                    return function (instance) {
                        args[index] = instance;
                        --count === 0 && cb(args);
                    };
                };

                for (var i = argConfigs.length - 1; i > -1; --i) {
                    var arg = argConfigs[i];
                    u.hasReference(arg) ? container.context.getComponent(arg.$ref, done(i)) : done(i)(arg);
                }
            }

            return Container;

        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
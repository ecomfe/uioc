void function (define) {
    define(
        function (require) {
            var u = require('./util');

            function Injector(context) {
                this.context = context;
                this.singletons = {};
            }

            Injector.prototype.createInstance = function (component, cb) {
                if (!component) {
                    return cb(null);
                }

                var id = component.id;
                if (component.scope === 'singleton' && u.hasOwn(this.singletons, id)) {
                    return cb(this.singletons[id]);
                }

                if (component.scope === 'static') {
                    return cb(component.creator);
                }

                var me = this;
                this.injectArgs(component, function (args) {
                    var instance = component.creator.apply(null, args);
                    if (component.scope === 'singleton') {
                        me.singletons[id] = instance;
                    }
                    cb(instance);
                });
            };

            Injector.prototype.injectArgs = function (componentConfig, cb) {
                var argConfigs = componentConfig.args;
                var count = argConfigs.length;
                var args = new Array(count);
                var ref = this.context.operators.ref;
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
                    ref.has(arg) ? this.context.getComponent(arg.$ref, done(i)) : done(i)(arg);
                }
            };

            Injector.prototype.injectProperties = function injectProperties(instance, componentConfig, cb) {
                var deps = componentConfig.propDeps;
                var props = componentConfig.properties;
                var ref = this.context.operators.ref;
                var setter = this.context.operators.setter;

                this.context.getComponent(deps, function () {
                    for (var k in props) {
                        var property = props[k];
                        var value = ref.has(property) ? arguments[u.indexOf(deps, property.$ref)] : property;
                        setter.setProperty(instance, k, value, setter.has(property) && property.$setter);
                    }
                    cb();
                });
            };

            Injector.prototype.injectSetters = function (instance, componentConfig, cb) {
                var deps = componentConfig.setterDeps || [];
                var setter = this.context.operators.setter;

                this.context.getComponent(deps, function () {
                    for (var i = deps.length - 1; i > -1; --i) {
                        var dep = deps[i];
                        setter.setProperty(instance, dep, arguments[i]);
                    }
                    cb();
                });
            };

            Injector.prototype.injectDependencies = function (instance, componentConfig, cb) {
                var complete = {
                    prop: false,
                    setter: false
                };
                var done = function (type) {
                    complete[type] = true;
                    complete.prop && complete.setter && cb();
                };
                this.injectProperties(instance, componentConfig, u.bind(done, null, 'prop'));
                this.injectSetters(instance, componentConfig, u.bind(done, null, 'setter'));
            };

            Injector.prototype.dispose = function () {
                var singletons = this.singletons;
                for (var k in singletons) {
                    var instance = singletons[k];
                    instance && typeof instance.dispose === 'function' && instance.dispose();
                }

                this.singletons = null;
            };

            return Injector;
        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });
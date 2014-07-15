void function (define) {
    define(
        function (require) {
            var util = require('./util');

            function Container(context) {
                this.context = context;
                this.singletons = {};
            }

            Container.prototype.createInstance = function (component) {
                if (!component) {
                    return null;
                }

                var id = component.id;
                if (component.scope === 'singleton' && this.singletons.hasOwnProperty(id)) {
                    return this.singletons[id];
                }

                if (component.scope === 'static') {
                    return component.creator;
                }

                var args = createArgs(this, component);
                var instance = component.creator.apply(null, args);
                this.injectPropDependencies(instance, component.properties);
                if (component.scope === 'singleton') {
                    this.singletons[id] = instance;
                }
                return instance;
            };

            Container.prototype.injectPropDependencies = function (instance, deps) {
                for (var k in deps) {
                    var dep = deps[k];
                    var value = dep;

                    if (util.hasReference(dep)) {
                        value = this.createInstance(this.context.getComponentConfig(dep.$ref));
                    }

                    var setter = this.getSetterName(k);
                    typeof instance[setter] === 'function' ? instance[setter](value) : (instance[k] = value);
                }
            };

            Container.prototype.injectSetterDependencies = function (instance, deps) {
                for (var i = deps.length - 1; i > -1; --i) {
                    var dep = deps[i];
                    var value = this.createInstance(this.context.getComponentConfig(dep));
                    instance[this.getSetterName(dep)](value);
                }
            };

            Container.prototype.getSetterName = function (prop) {
                return 'set' + prop.charAt(0).toUpperCase() + prop.slice(1);

            };

            Container.prototype.dispose = function () {
                var singletons = this.singletons;
                for (var k in singletons) {
                    var instance = singletons[k];
                    instance && typeof instance.dispose === 'function' && instance.dispose();
                }

                this.singletons = null;
            };


            function createArgs(container, component) {
                var argConfigs = component.args;
                var args = Array(argConfigs.length);
                for (var i = argConfigs.length - 1; i > -1; --i) {
                    var arg = argConfigs[i];
                    args[i] = util.hasReference(arg) ?
                        container.createInstance(container.context.getComponentConfig(arg.$ref))
                        : arg;
                }

                return args;
            }

            return Container;

        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
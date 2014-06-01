void function (define) {
    define(function () {

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

            if (component.scope === 'singleton' && component.instance) {
                return component.instance;
            }

            var args = createArgs(this, component);
            var instance = component.creator.apply(null, args);
            injectProperties(this, component, instance);
            if (component.scope === 'singleton') {
                component.instance = instance;
            }
            return instance;
        };

        Container.prototype.dispose = function () {

        };


        function createArgs(container, component) {
            var argConfigs = component.args;
            var args = Array(argConfigs.length);
            for (var i = argConfigs.length - 1; i > -1; --i) {
                var arg = argConfigs[i];
                args[i] = typeof arg.$ref == 'string' ?
                    container.createInstance(container.context.getComponentConfig(arg.$ref))
                    : arg;
            }

            return args;
        }

        function injectProperties(container, component, instance) {
            var properties = component.properties;
            for (var k in properties) {
                var property = properties[k];
                var value = property;

                if (typeof property === 'object' && typeof property.$ref === 'string') {
                    value = container.createInstance(container.context.getComponentConfig(property.$ref));
                }


                var setter = getSetter(instance, k, property);
                setter.call(instance, value);
            }
        }

        function getSetter(instance, k, v) {
            var name = typeof v === 'object' && typeof v.$setter === 'string' ? v.$setter
                : 'set' + k.charAt(0).toUpperCase() + k.substr(1);

            return typeof instance[name] === 'function' ? instance[name] : getCommonSetter(k);
        }

        function getCommonSetter(k) {
            return function (v) {
                this[k] = v;
            }
        }

        return Container;

    });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
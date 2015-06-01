void function (define, undefined) {

    define(
        function (require) {

            var u = require('../util');
            var SETTER_REGEX = /^set[A-Z]/;
            var SET_LEGTH = 'set'.length;

            /**
             * Setter操作符，负责解析$stter, 以及setter注入相关工作
             *
             * @param {IoC} context ioc容器实例
             * @constructor
             */
            function Setter(context) {
                this.context = context;
            }

            /**
             * 从组件实例上解析组件的setter依赖
             *
             * @param {ComponentConfig} config 组件配置
             * @param {*} instance 组件实例
             *
             * @returns {ComponentConfig}
             */
            Setter.prototype.resolveDependencies = function resolveDependencies(config, instance) {
                if (config.setterDeps || !config.auto) {
                    return config;
                }

                var exclude = config.properties || {};
                var deps = [];
                var context = this.context;
                var prop = null;


                if (typeof Object.getOwnPropertyNames === 'function' && typeof Object.getPrototypeOf === 'function') {
                    var resultSet = Object.create(null);
                    for (var proto = instance; proto; proto = Object.getPrototypeOf(proto)) {
                        var properties = Object.getOwnPropertyNames(proto);
                        for (var i = 0, len = properties.length; i < len; ++i) {
                            prop = properties[i];
                            // 去重
                            if (!resultSet[prop]) {
                                resultSet[prop] = true;
                                prop = this.getPropertyFromSetter(instance, prop);
                                prop && !u.hasOwn(exclude, prop) && context.hasComponent(prop) && deps.push(prop);
                            }
                        }
                    }
                }

                else {
                    for (var k in instance) {
                        prop = this.getPropertyFromSetter(instance, k);
                        // 有属性，未和属性配置冲突，且组件已注册
                        prop && !u.hasOwn(exclude, prop) && context.hasComponent(prop) && deps.push(prop);
                    }
                }

                config.setterDeps = deps;
                return config;
            };

            /**
             * 检测是否有$setter操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            Setter.prototype.has = function (obj) {
                return u.isObject(obj) && typeof obj.$setter === 'string';
            };

            /**
             * 从setter函数名解析对应的属性名
             *
             * @private
             * @returns {string | null}
             */
            Setter.prototype.getPropertyFromSetter = function (instance, name) {
                var prop = null;
                if (typeof instance[name] === 'function' && SETTER_REGEX.test(name)) {
                    prop = name.charAt(SET_LEGTH).toLowerCase() + name.slice(SET_LEGTH + 1);
                }

                return prop;
            };

            Setter.prototype.setProperty = function (instance, propertyName, value, setterName) {
                if (setterName) {
                    return instance[setterName](value);
                }

                var method = 'set' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                typeof instance[method] === 'function' ? instance[method](value) : (instance[propertyName] = value);

            };

            return Setter;
        }
    )
    ;

}(typeof define === 'function'
&& define.amd ? define : function (factory) { module.exports = factory(require); });

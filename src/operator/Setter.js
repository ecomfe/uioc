void function (define, undefined) {

    define(
        function (require) {

            var u = require('../util');
            var SETTER_REGEX = /^set([A-Z].*)$/;

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
                if (!config.setterDeps && config.auto) {
                    var exclude = config.properties || {};
                    var deps = [];
                    var prop = null;
                    for (var k in instance) {
                        if (typeof instance[k] === 'function') {
                            prop = this.getPropertyFromSetter(k);

                            // 有属性，未和属性配置冲突，且组件已注册
                            prop && !u.hasOwn(exclude, prop) && this.context.hasComponent(prop) && deps.push(prop);
                        }
                    }

                    config.setterDeps = deps;
                }
                return config;
            };

            /**
             * 检测是否有$import操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            Setter.prototype.has = function (obj) {
                return u.isObject(obj) && typeof obj.$ref === 'string';
            };

            /**
             * 从setter函数名解析对应的属性名
             *
             * @param {string} name 函数名
             *
             * @returns {string}
             */
            Setter.prototype.getPropertyFromSetter = function (name) {
                var prop = null;
                var matches = name.match(SETTER_REGEX);
                if (matches) {
                    prop = matches[1];
                    prop = prop.charAt(0).toLowerCase() + prop.slice(1);
                }

                return prop;
            };

            return Setter;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

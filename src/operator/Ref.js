void function (define, undefined) {

    define(
        function (require) {

            var u = require('../util');

            /**
             * Ref操作符，负责解析 $ref
             *
             * @param {IoC} context ioc容器实例
             * @constructor
             */
            function Ref(context) {
                this.context = context;
            }

            /**
             * 处理组件配置
             *
             * @param {ComponentConfig} config 组件配置
             *
             * @returns {ComponentConfig}
             */
            Ref.prototype.process = function process(config) {
                config.argDeps = config.argDeps || this.getDependenciesFromArgs(config.args);
                config.propDeps = config.propDeps || this.getDependenciesFromProperties(config.properties);
                return config;
            };

            /**
             * 检测是否有$ref操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            Ref.prototype.has = function (obj) {
                return u.isObject(obj) && typeof obj.$ref === 'string';
            };

            Ref.prototype.getDependenciesFromArgs = function getDependenciesFromArgs(args) {
                var deps = [];
                for (var i = args.length - 1; i > -1; --i) {
                    this.has(args[i]) && u.addToSet(deps, args[i].$ref);
                }
                return deps;
            };

            Ref.prototype.getDependenciesFromProperties = function getDependenciesFromProperties(properties) {
                var deps = [];
                for (var k in properties) {
                    if (u.hasOwn(properties, k)) {
                        var prop = properties[k];
                        this.has(prop) && u.addToSet(deps, prop.$ref);
                    }
                }
                return deps;
            };

            return Ref;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

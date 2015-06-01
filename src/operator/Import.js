void function (define, undefined) {

    define(
        function (require) {
            var u = require('../util');
            var ANONY_PREFIX = '^uioc-';

            /**
             * Import操作符，负责解析 $import
             *
             * @param {IoC} context ioc容器实例
             * @constructor
             */
            function Import(context) {
                this.context = context;
            }

            /**
             * 处理组件配置
             *
             * @param {ComponentConfig} config 组件配置
             *
             * @returns {ComponentConfig}
             */
            Import.prototype.process = function process(config) {
                config.anonyDeps = config.anonyDeps || this.transformAnonymousComponents(config);
                return config;
            };

            /**
             * 检测是否有$import操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            Import.prototype.has = function (obj) {
                return u.isObject(obj) && typeof obj.$import === 'string';
            };

            /**
             * 抽取并转化匿名构件
             * @ignored
             * @param {ComponentConfig} config 组件配置
             */
            Import.prototype.transformAnonymousComponents = function transformAnonymousComponents(config) {
                var deps = [];

                // 解析构造函数参数
                var args = config.args;
                var id = null;
                for (var i = args.length - 1; i > -1; --i) {
                    if (this.has(args[i])) {
                        // 给匿名组件配置生成一个 ioc 构件id
                        id = this.createAnonymousConfig(config, args[i], '$arg.' + i + '.');
                        args[i] = {$ref: id};
                        deps.push(id);
                    }
                }

                // 解析属性
                var props = config.properties;
                for (var k in props) {
                    if (this.has(props[k])) {
                        id = this.createAnonymousConfig(config, props[k], '$prop.' + k + '.');
                        props[k] = {$ref: id};
                        deps.push(id);
                    }
                }

                return deps;
            };

            /**
             * 创建匿名组件配置，会自动生成一个唯一的组件id
             *
             * @param {ComponentConfig} componentConfig 组件配置
             * @param {*} config 依赖配置
             * @param {string} idPrefix 匿名组件id前缀
             *
             * @return {string} 返回匿名组件id
             */
            Import.prototype.createAnonymousConfig = function createAnonymousConfig(componentConfig, config, idPrefix) {
                var importId = config && config.$import;
                if (!this.context.hasComponent(importId)) {
                    throw new Error('$import `%s` component, but it is not exist, please check!!', config.$import);
                }

                var refConfig = this.context.getComponentConfig(importId);
                var id = componentConfig.id + '-' + idPrefix + importId;
                config.id = id = (id.indexOf(ANONY_PREFIX) !== -1 ? '' : ANONY_PREFIX) + id;
                config.$import = null;
                this.context.addComponent(id, u.merge(refConfig, config));

                return id;
            };

            return Import;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

void function (define, undefined) {

    define(
        function (require) {

            var u = require('../util');

            /**
             * Map操作符，负责解析 $list
             *
             * @param {IoC} context ioc容器实例
             * @constructor
             */
            function Map(context) {
                this.context = context;
            }

            /**
             * 解析组件依赖
             *
             * @param {ComponentConfig} config 组件配置
             *
             * @returns {ComponentConfig}
             */
            Map.prototype.process = function process(config) {
                var args = config.args;
                for (var i = 0, len = args.length; i < len; ++i) {
                    var arg = args[i];
                    // {$map: {}} => {$import: Map.MAP_COMPONENT_ID, properties: {}}
                    if (this.has(arg)) {
                        args[i] = {
                            $import: Map.MAP_COMPONENT_ID,
                            properties: arg.$map
                        };
                    }
                }

                var properties = config.properties;
                for (var k in properties) {
                    var property = properties[k];
                    if (this.has(property)) {
                        properties[k] = {
                            $import: Map.MAP_COMPONENT_ID,
                            properties: property.$map
                        };
                    }
                }

                return config;
            };

            /**
             * 检测是否有$map操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            Map.prototype.has = function (obj) {
                return u.isObject(obj) && u.isObject(obj.$map);
            };

            Map.MAP_COMPONENT_CONFIG = {
                creator: Object,
                isFactory: true
            };

            Map.MAP_COMPONENT_ID = (new Date()).getTime() + '_map';

            return Map;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

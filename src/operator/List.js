void function (define, undefined) {

    define(
        function (require) {

            var u = require('../util');

            /**
             * List操作符，负责解析 $list
             *
             * @param {IoC} context ioc容器实例
             * @constructor
             */
            function List(context) {
                this.context = context;
            }

            /**
             * 解析组件依赖
             *
             * @param {ComponentConfig} config 组件配置
             *
             * @returns {ComponentConfig}
             */
            List.prototype.process = function process(config) {
                var args = config.args;
                for (var i = 0, len = args.length; i < len; ++i) {
                    var arg = args[i];
                    // {$list: [{}, {}]} => {$import: List.LIST_COMPONENT_ID, args: []}
                    if (this.has(arg)) {
                        args[i] = {
                            $import: List.LIST_COMPONENT_ID,
                            args: arg.$list
                        };
                    }
                }

                var properties = config.properties;
                for (var k in properties) {
                    var property = properties[k];
                    if (this.has(property)) {
                        properties[k] = {
                            $import: List.LIST_COMPONENT_ID,
                            args: property.$list
                        };
                    }
                }

                return config;
            };

            /**
             * 检测是否有$list操作符
             *
             * @param {Object} obj 检测对象
             *
             * @return {boolean}
             */
            List.prototype.has = function (obj) {
                return u.isObject(obj) && obj.$list instanceof Array;
            };

            List.LIST_COMPONENT_CONFIG = {
                creator: function () {
                    return [].slice.call(arguments, 0);
                },
                isFactory: true
            };

            List.LIST_COMPONENT_ID = (new Date()).getTime() + '_list';

            return List;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

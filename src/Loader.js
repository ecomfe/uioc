void function (define, undefined) {

    define(
        function (require) {

            var DependencyTree = require('./DependencyTree');
            var u = require('./util');

            function CreatorFactory(creator, args) {
                return creator.apply(this, args);
            }

            /**
             * 组件模块加载器，负责加载组件模块，将组件的amd工厂函数包装为ioc的creator。
             *
             * @constructor
             */
            function Loader(context) {
                this.context = context;
            }

            /**
             * 设置组件的加载器
             *
             * @param {Function} amdGlobalLoader 符合 amd 规范的加载器
             */
            Loader.prototype.setLoaderFunction = function (amdGlobalLoader) {
                this.amdLoader = amdGlobalLoader;
            };

            Loader.prototype.resolveDependentModules = function (componentConfig, result, deps) {
                return getDependentModules(componentConfig, this.context, result || {}, new DependencyTree(), deps);
            };

            function getDependentModules(component, context, result, depTree, deps) {
                var module = component.module;
                if (typeof component.creator !== 'function' && module) {
                    result[module] = result[module] || [];
                    result[module].push(component);
                }
                context.processStaticConfig(component.id);

                var circular = depTree.checkForCircular(component.id);
                if (circular) {
                    var msg = component.id + ' has circular dependencies ';
                    throw new u.CircularError(msg, component);
                }

                depTree.addData(component);
                var child = depTree.appendChild(new DependencyTree());

                deps = deps || component.argDeps.concat(component.propDeps).concat(component.setterDeps || []);
                for (var i = deps.length - 1; i > -1; --i) {
                    if (context.hasComponent(deps[i])) {
                        getDependentModules(context.getComponentConfig(deps[i]), context, result, child);
                    }
                }

                return result;
            }

            Loader.prototype.loadModuleMap = function loadModuleMap(moduleMap, cb) {
                var modules = u.keys(moduleMap);
                var me = this;
                this.amdLoader(modules, function () {
                    for (var i = arguments.length - 1; i > -1; --i) {
                        var factory = arguments[i];
                        var configArray = moduleMap[modules[i]];
                        for (var j = configArray.length - 1; j > -1; --j) {
                            var config = configArray[j];
                            typeof config.creator !== 'function' && me.wrapCreator(config, factory);
                        }
                    }
                    cb();
                });
            };

            Loader.prototype.wrapCreator = function wrapCreator(config, factory) {
                var creator = config.creator = config.creator || factory;

                if (typeof creator === 'string') {
                    var method = factory[creator];
                    var moduleFactory = function () {
                        return method.apply(factory, arguments);
                    };

                    creator = (!config.isFactory || config.scope === 'static') ? method : moduleFactory;
                    config.creator = creator;
                }

                // 给字面量组件和非工厂组件套一层 creator，后面构造实例就可以无需分支判断，直接调用 component.creator
                if (!config.isFactory && config.scope !== 'static') {
                    config.creator = function () {
                        CreatorFactory.prototype = creator.prototype;
                        return new CreatorFactory(creator, arguments);
                    };
                }
            };

            return Loader;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

/**
 * @file IoC 类
 * @author exodia (d_xinxin@163.com)
 */
void function (define, global, undefined) {
    define(
        function (require) {
            var Container = require('./Container');
            var u = require('./util');
            var Ref = require('./operator/Ref');
            var Import = require('./operator/Import');
            var Setter = require('./operator/Setter');
            var Loader = require('./Loader');
            var globalLoader = global.require;

            /**
             * IoC 容器类，根据配置实例化一个 IoC 容器
             * @class IoC
             *
             * @param {Object} [config] IoC 配置
             * @param {Function} [config.loader=require] 符合 AMD 规范的模块加载器，默认为全局的 require
             * @param {Object.<string, ComponentConfig>} [config.components]
             * 批量配置构件, 其中每个key 为构件 id，值为构建配置对象，配置选项见 @link IoC#addComponent
             *
             * @returns {IoC}
             */
            function IoC(config) {
                config = config || {};
                if (!(this instanceof IoC)) {
                    return new IoC(config);
                }

                this.loader = new Loader(this);
                this.setLoaderFunction(config.loader || globalLoader);
                this.components = {};
                this.operators = {
                    import: new Import(this),
                    ref: new Ref(this),
                    setter: new Setter(this)
                };
                this.container = new Container(this);
                this.addComponent(config.components || {});
            }

            /**
             *
             * 向容器中注册构件
             *
             * @method IoC#addComponent
             * @param {String | ComponentConfig} id
             * @param {ComponentConfig} [config]
             * @example
             * ioc.addComponent('list', {
             *     // 构造函数创建构件 new creator, 或者字符串，字符串则为 amd 模块名
             *     creator: require('./List'),
             *     scope: 'transient',
             *     args: [{$ref: 'entityName'}],
             *
             *     // 属性注入， 不设置$setter, 则直接instance.xxx = xxx
             *     properties: {
             *          model: {$ref: 'listModel'},
             *          view: {$ref: 'listView'},
             *          name: 'xxxx' // 未设置$ref/$import操作符，'xxxx' 即为依赖值
             *     }
             * });
             *
             * ioc.addComponent('listData', {
             *     creator: 'ListData',
             *     scope: 'transient',
             *
             *     properties: {
             *          data: {
             *              $import: 'requestStrategy', // 创建匿名组件，默认继承 requestStrategy 的配置，
             *              args:['list', 'list'] // 重写 requestStrategy 的 args 配置
             *          },
             *     }
             * });
             */
            IoC.prototype.addComponent = function (id, config) {
                var ids = [];
                if (typeof id === 'string') {
                    var conf = {};
                    conf[id] = config;
                    this.addComponent(conf);
                }
                else {
                    for (var k in id) {
                        if (this.hasComponent(k)) {
                            u.warn(id + ' has been add! This will be no effect');
                            continue;
                        }
                        this.components[k] = createComponent.call(this, k, id[k]);
                        ids.push(k);
                    }
                }

                for (var i = ids.length - 1; i > -1; --i) {
                    config = this.getComponentConfig(ids[i]);
                    this.operators.import.resolveDependencies(config);
                    this.operators.ref.resolveDependencies(config);
                }
            };


            /**
             * 获取构件实例成功后的回调函数
             *
             * @callback getComponentCallback
             * @param {...*} component 获取的构件实例，顺序对应传入的 id 顺序
             */
            /**
             * 获取构件实例
             *
             * @method IoC#getComponent
             * @param {string | string[]} ids 构件 id，数组或者字符串
             * @param {getComponentCallback} cb 获取构件成功后的回调函数，构件将按 id 的顺序依次作为参数传入
             * @returns {IoC}
             */
            IoC.prototype.getComponent = function (ids, cb) {
                ids = ids instanceof Array ? ids : [ids];
                var moduleMap = {};

                for (var i = 0, len = ids.length; i < len; ++i) {
                    var id = ids[i];
                    var config = this.getComponentConfig(id);
                    if (!config) {
                        u.warn('`%s` has not been added to the Ioc', id);
                    }
                    else {
                        moduleMap = this.loader.resolveDependentModules(config, moduleMap, config.argDeps);
                    }
                }

                this.loader.loadModuleMap(moduleMap, u.bind(createInstances, this, ids, cb));

                return this;
            };

            IoC.prototype.hasComponent = function (id) {
                return !!this.components[id];
            };

            IoC.prototype.getComponentConfig = function (id) {
                return this.components[id];
            };

            /**
             * 设置 IoC 的模块加载器
             *
             * @method IoC#setAMDLoader
             * @param {Function} amdLoader 符合 AMD 规范的模块加载器
             */
            IoC.prototype.setLoaderFunction = function (amdLoader) {
                this.loader.setLoaderFunction(amdLoader);
            };

            /**
             * 销毁容器，会遍历容器中的单例，如果有设置dispose，调用他们的 dispose 方法
             *
             * @method IoC#dispose
             */
            IoC.prototype.dispose = function () {
                this.container.dispose();
                this.components = null;
                this.dependencyResolver = null;
            };

            function createComponent(id, config) {
                var component = {
                    id: id,
                    args: config.args || [],
                    properties: config.properties || {},
                    anonyDeps: null,
                    argDeps: null,
                    propDeps: null,
                    setterDeps: null,
                    scope: config.scope || 'transient',
                    creator: config.creator || null,
                    module: config.module || undefined,
                    isFactory: !!config.isFactory,
                    auto: !!config.auto,
                    instance: null
                };

                // creator为函数，那么先包装下
                typeof component.creator === 'function' && this.loader.wrapCreator(component);

                return component;
            }

            function createInstances(ids, cb) {
                var instances = new Array(ids.length);
                if (ids.length === 0) {
                    return cb.apply(null, instances);
                }

                var container = this.container;
                var loader = this.loader;
                var context = this;
                var moduleMap = {};
                var count = ids.length;
                var done = function () {
                    --count === 0 && cb.apply(null, instances);
                };

                var task = function (index, component) {
                    return function (instance) {
                        instances[index] = instance;
                        if (component) {
                            // 获取 setter 依赖
                            context.operators.setter.resolveDependencies(component, instance);
                            moduleMap = loader.resolveDependentModules(component, {}, component.propDeps.concat(component.setterDeps));
                            loader.loadModuleMap(moduleMap, u.bind(injectDeps, context, instance, component, done));
                        }
                        else {
                            done();
                        }
                    };
                };

                for (var i = ids.length - 1; i > -1; --i) {
                    var component = this.components[ids[i]];
                    container.createInstance(component, task(i, component));
                }
            }

            function injectDeps(instance, component, cb) {
                var complete = {
                    prop: false,
                    setter: false
                };
                var injected = function (type) {
                    complete[type] = true;
                    complete.prop && complete.setter && cb();
                };
                injectPropDependencies(this, instance, component, u.bind(injected, null, 'prop'));
                injectSetterDependencies(this, instance, component, u.bind(injected, null, 'setter'));
            }

            function injectSetterDependencies(context, instance, component, cb) {
                var deps = component.setterDeps || [];
                context.getComponent(deps, function () {
                    for (var i = deps.length - 1; i > -1; --i) {
                        var dep = deps[i];
                        setProperty(instance, dep, arguments[i]);
                    }
                    cb();
                });
            }

            function injectPropDependencies(context, instance, component, cb) {
                var deps = component.propDeps;
                var props = component.properties;
                context.getComponent(deps, function () {
                    for (var k in props) {
                        var value = props[k];
                        if (context.operators.ref.has(value)) {
                            value = arguments[u.indexOf(deps, value.$ref)];
                        }
                        setProperty(instance, k, value);
                    }
                    cb();
                });
            }

            function setProperty(instance, key, value) {
                var name = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                typeof instance[name] === 'function' ? instance[name](value) : (instance[key] = value);
            }

            return IoC;
        }
    );

}(typeof define === 'function' && define.amd ?
    define : function (factory) { module.exports = factory(require); }, this);
/**
 * @file IoC 容器类
 * @author exodia (d_xinxin@163.com)
 */

import Injector from './Injector';
import u from './util';
import Loader from './Loader';
import ImportPlugin from './plugins/ImportPlugin';
import AutoPlugin from './plugins/AutoPlugin';
import PropertyPlugin from './plugins/PropertyPlugin';
import ListPlugin from './plugins/ListPlugin';
import MapPlugin from './plugins/MapPlugin';
import AopPlugin from './plugins/AopPlugin';

const PLUGIN_COLLECTION = Symbol('collection');
const COMPONENTS = Symbol('components');
const CREATE_COMPONENT = Symbol('createComponent');
const CREATE_INSTANCE = Symbol('createInstance');
const NULL = {};


export default class IoC {
    /**
     * 根据配置实例化一个 IoC 容器
     *
     * @param {IoCConfig} [config] ioc 容器配置
     */
    constructor(config = {}) {
        this[COMPONENTS] = Object.create(null);
        this[PLUGIN_COLLECTION] = new PluginCollection([
            new ListPlugin(),
            new MapPlugin(),
            new ImportPlugin(),
            new AopPlugin(),
            new PropertyPlugin(),
            new AutoPlugin()
        ]);
        this[PLUGIN_COLLECTION].addPlugins(config.plugins);
        this.loader = new Loader(this);
        this.injector = new Injector(this);
        config = this[PLUGIN_COLLECTION].onContainerInit(this, config);
        this.initConfig(config);
    }

    /**
     * 初始化配置
     * @param {IoCConfig} iocConfig ioc 配置
     * @protected
     */
    initConfig(iocConfig) {

        iocConfig.loader && this.setLoaderFunction(iocConfig.loader);

        this.addComponent(iocConfig.components || {});
    }

    /**
     *
     * 向容器中注册组件
     *
     * @param {string | Object.<string, ComponentConfig>} id 组件 id 或者组件配置集合
     * @param {ComponentConfig} [config] 组件配置, 第一个参数为组件 id 时有效
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
    addComponent(id, config) {
        if (typeof id === 'object') {
            for (let k in id) {
                this.addComponent(k, id[k]);
            }
            return;
        }

        if (this.hasComponent(id)) {
            u.warn(`${id} has been add! This will be no effect`);
        }
        else {
            this[COMPONENTS][id] = this[CREATE_COMPONENT].call(this, id, config);
        }
    }

    /**
     * 获取构件实例
     *
     * @param {string | string[]} id 组件 id，数组或者字符串
     * @return {Promise} 返回值为组件实例（传入参数为组件数组时, 值为组件实例数组)的 promise
     */
    getComponent(id) {
        if (id instanceof Array) {
            return Promise.all(id.map(id => this.getComponent(id)));
        }
        let moduleMap = Object.create(null);

        if (!this.hasComponent(id)) {
            u.warn('`%s` has not been added to the Ioc', id);
        }
        else {
            let config = this.getComponentConfig(id);
            this.processConfig(id);
            try {
                moduleMap = this.loader.resolveDependentModules(config, moduleMap, config.argDeps);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }

        return this.loader.loadModuleMap(moduleMap).then(() => this[CREATE_INSTANCE](id));
    }

    /**
     * 检测是否注册过某个组件
     *
     * @param {string} id 组件 id
     * @return {boolean}
     */
    hasComponent(id) {
        return !!this[COMPONENTS][id];
    }

    /**
     * 获取构件配置，不传入则返回所有组件配置
     *
     * @param {string} [id] 组件id
     * @return {*}
     */
    getComponentConfig(id) {
        return id ? this[COMPONENTS][id] : this[COMPONENTS];
    }

    /**
     * 设置 IoC 的模块加载器
     *
     * @param {Function} amdLoader 符合 AMD 规范的模块加载器
     */
    setLoaderFunction(amdLoader) {
        this.loader.setLoaderFunction(amdLoader);
    }

    /**
     * 销毁容器，会遍历容器中的单例，如果有设置 dispose，调用他们的 dispose 方法
     */
    dispose() {
        this[PLUGIN_COLLECTION].onContainerDispose(this);
        this.injector.dispose();
        this[COMPONENTS] = null;
    }

    /**
     * 在指定位置添加插件
     *
     * @param {ILifeCircleHook} plugins 插件数组
     * @param {number} [pos] 插入位置, 默认为当前 ioc 容器插件队列末尾
     */
    addPlugins(plugins, pos) {
        return this[PLUGIN_COLLECTION].addPlugins(plugins, pos);
    }

    /**
     * 获取当前实例的插件队列
     *
     * @return {ILifeCircleHook[]}
     */
    getPlugins() {
        return this[PLUGIN_COLLECTION].getPlugins();
    }

    /**
     * 移除指定的插件或指定位置的插件
     *
     * @param {number | ILifeCircleHook} pluginOrPos 插件实例或者插件位置
     * @return {bool} 成功移除返回 true
     */
    removePlugin(pluginOrPos) {
        return this[PLUGIN_COLLECTION].removePlugin(pluginOrPos);
    }

    processConfig(id) {
        let config = this.getComponentConfig(id);
        config = this[PLUGIN_COLLECTION].onGetComponent(this, id, config);
        this[COMPONENTS][id] = config;
        if (!config.argDeps) {
            let deps = config.argDeps = [];
            let args = config.args;
            for (let i = args.length - 1; i > -1; --i) {
                u.hasRef(args[i]) && deps.push(args[i].$ref);
            }
        }
    }

    [CREATE_COMPONENT](id, config) {
        config = this[PLUGIN_COLLECTION].onAddComponent(this, id, config);
        let component = {
            id,
            args: [],
            properties: {},
            argDeps: null,
            propDeps: null,
            setterDeps: null,
            scope: 'transient',
            creator: null,
            module: undefined,
            isFactory: false,
            auto: false,
            instance: null,
            ...config
        };

        // creator为函数，那么先包装下
        typeof component.creator === 'function' && this.loader.wrapCreator(component);

        return component;
    }

    [CREATE_INSTANCE](id) {
        return this[PLUGIN_COLLECTION].beforeCreateInstance(this, id)
            .then(
                instance => {
                    if (instance === NULL) {
                        let component = this.hasComponent(id) ? this.getComponentConfig(id) : null;
                        return this.injector.createInstance(component);
                    }

                    return instance;
                }
            )
            .then(instance => this[PLUGIN_COLLECTION].afterCreateInstance(this, id, instance));
    }
}


const PLUGINS = Symbol('plugins');

class PluginCollection {
    constructor(plugins = []) {
        this[PLUGINS] = plugins;
    }

    onContainerInit(ioc, iocConfig) {
        return this[PLUGINS].reduce(
            (config, plugin) => plugin.onContainerInit(ioc, config),
            iocConfig
        );
    }

    onAddComponent(ioc, componentId, initialComponentConfig) {
        return this[PLUGINS].reduce(
            (componentConfig, plugin) => plugin.onAddComponent(ioc, componentId, componentConfig),
            initialComponentConfig
        );
    }

    onGetComponent(ioc, componentId, initialComponentConfig) {
        return this[PLUGINS].reduce(
            (componentConfig, plugin) => plugin.onGetComponent(ioc, componentId, componentConfig),
            initialComponentConfig
        );
    }

    beforeCreateInstance(ioc, componentId) {
        return this[PLUGINS].reduce(
            (instancePromise, plugin) => instancePromise.then(
                instance => {
                    instance = instance === NULL ? undefined : instance;
                    let result = plugin.beforeCreateInstance(ioc, componentId, instance);
                    return u.isPromise(result) ? result : Promise.resolve(NULL);
                }
            ),
            Promise.resolve(NULL)
        );
    }

    afterCreateInstance(ioc, componentId, instance) {
        return this[PLUGINS].reduce(
            (instancePromise, plugin) => instancePromise.then(
                instance => {
                    let result = plugin.afterCreateInstance(ioc, componentId, instance);
                    return u.isPromise(result) ? result : Promise.resolve(instance);
                }
            ),
            Promise.resolve(instance)
        );
    }

    onContainerDispose(ioc) {
        this[PLUGINS].forEach(plugin => plugin.onContainerDispose(ioc));
    }

    addPlugins(plugins = [], pos = this[PLUGINS].length) {
        this[PLUGINS].splice(pos, 0, ...plugins);
    }

    getPlugins() {
        return this[PLUGINS].slice(0);
    }

    removePlugin(pluginOrPos) {
        if (typeof pluginOrPos !== 'number') {
            pluginOrPos = this[PLUGINS].indexOf(pluginOrPos);
            pluginOrPos = pluginOrPos === -1 ? this[PLUGINS].length : pluginOrPos;
        }

        return !!this[PLUGINS].splice(pluginOrPos, 1).length;
    }
}
/**
 * @file IoC.js IoC 容器类
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

const PLUGIN_COLLECTION = Symbol('collection');
const COMPONENTS = Symbol('components');
const CREATE_COMPONENT = Symbol('createComponent');
const CREATE_INSTANCE = Symbol('createInstance');

export default class IoC {

    constructor(config = {}) {
        this[COMPONENTS] = Object.create(null);
        this[PLUGIN_COLLECTION] = new PluginCollection([
            new ListPlugin(),
            new MapPlugin(),
            new ImportPlugin(),
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
     * @protected
     */
    initConfig(iocConfig) {

        iocConfig.loader && this.setLoaderFunction(iocConfig.loader);

        this.addComponent(iocConfig.components || {});
    }

    addComponent(id, config) {
        if (typeof id === 'string') {
            this.addComponent({[id]: config});
        }
        else {
            for (let k in id) {
                if (this.hasComponent(k)) {
                    u.warn(`${k} has been add! This will be no effect`);
                    continue;
                }
                this[COMPONENTS][k] = this[CREATE_COMPONENT].call(this, k, id[k]);
            }
        }
    }

    getComponent(ids) {
        let isSingle = true;
        if (ids instanceof Array) {
            isSingle = false;
        }
        ids = [].concat(ids);
        let moduleMap = Object.create(null);

        for (let i = 0, len = ids.length; i < len; ++i) {
            let id = ids[i];
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
        }

        return this.loader.loadModuleMap(moduleMap)
            .then(() => this[CREATE_INSTANCE](ids))
            .then(instances => isSingle ? instances[0] : instances);
    }

    addPlugins(plugins, pos) {
        return this[PLUGIN_COLLECTION].addPlugins(plugins, pos);
    }

    getPlugins() {
        return this[PLUGIN_COLLECTION].getPlugins();
    }

    removePlugin(pluginOrPos) {
        return this[PLUGIN_COLLECTION].removePlugin(pluginOrPos);
    }

    hasComponent(id) {
        return !!this[COMPONENTS][id];
    }

    getComponentConfig(id) {
        return id ? this[COMPONENTS][id] : this[COMPONENTS];
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

    setLoaderFunction(amdLoader) {
        this.loader.setLoaderFunction(amdLoader);
    }

    dispose() {
        this[PLUGIN_COLLECTION].onContainerDispose(this);
        this.injector.dispose();
        this[COMPONENTS] = null;
    }

    [CREATE_COMPONENT](id, config) {
        config = this[PLUGIN_COLLECTION].onAddComponent(this, id, config);
        let component = {
            id,
            args: config.args || [],
            properties: config.properties || {},
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

    [CREATE_INSTANCE](ids) {
        return Promise.all(
            ids.map(
                id => {
                    let instance = this[PLUGIN_COLLECTION].beforeCreateInstance(this, id);
                    if (u.isPromise(instance)) {
                        return instance;
                    }

                    let component = this.hasComponent(id) ? this.getComponentConfig(id) : null;
                    return this.injector.createInstance(component)
                        .then(instance => this[PLUGIN_COLLECTION].afterCreateInstance(this, id, instance));
                }
            )
        );
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
            (instance, plugin) => plugin.beforeCreateInstance(ioc, componentId, instance),
            undefined
        );
    }

    afterCreateInstance(ioc, componentId, instance) {
        return this[PLUGINS].reduce(
            (instancePromise, plugin) => instancePromise.then(
                instance => plugin.afterCreateInstance(ioc, componentId, instance)
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
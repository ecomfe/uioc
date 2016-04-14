/**
 * @file IoC.js IoC 容器类
 * @author exodia (d_xinxin@163.com)
 */

import Injector from './Injector';
import u from './util';
import Ref from './operator/Ref';
import Setter from './operator/Setter';
import Loader from './Loader';
import ImportPlugin from './plugins/ImportPlugin';
import ListPlugin from './plugins/ListPlugin';
import MapPlugin from './plugins/MapPlugin';

const PLUGIN_COLLECTION = Symbol('collection');

export default class IoC {
    components = {};

    constructor(config = {}) {
        this[PLUGIN_COLLECTION] = new PluginCollection([
            new ListPlugin(),
            new MapPlugin(),
            new ImportPlugin()
        ]);
        this.loader = new Loader(this);
        this.operators = {
            ref: new Ref(this),
            setter: new Setter(this)
        };
        this.injector = new Injector(this);
        this[PLUGIN_COLLECTION].addPlugins(config.plugins);
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
                this.components[k] = createComponent.call(this, k, id[k]);
            }
        }
    }

    getComponent(ids) {
        let isSingle = true;
        if (ids instanceof Array) {
            isSingle = false;
        }
        ids = [].concat(ids);
        let moduleMap = {};

        for (let i = 0, len = ids.length; i < len; ++i) {
            let id = ids[i];
            if (!this.hasComponent(id)) {
                u.warn('`%s` has not been added to the Ioc', id);
            }
            else {
                let config = this.getComponentConfig(id);
                this.processStaticConfig(id);
                try {
                    moduleMap = this.loader.resolveDependentModules(config, moduleMap, config.argDeps);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            }
        }

        return this.loader.loadModuleMap(moduleMap)
            .then(() => this::createInstances(ids))
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
        return !!this.components[id];
    }

    getComponentConfig(id) {
        return id ? this.components[id] : this.components;
    }

    processStaticConfig(id) {
        let config = this.getComponentConfig(id);
        config = this[PLUGIN_COLLECTION].onGetComponent(this, id, config);
        this.components[id] = config;
        this.operators.ref.process(config);
    }

    setLoaderFunction(amdLoader) {
        this.loader.setLoaderFunction(amdLoader);
    }

    dispose() {
        this[PLUGIN_COLLECTION].onContainerDispose(this);
        this.injector.dispose();
        this.components = null;
    }
}

function createComponent(id, config) {
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

function createInstances(ids) {
    let injector = this.injector;
    let loader = this.loader;
    let setter = this.operators.setter;
    let moduleMap = {};

    function task(config, instance) {
        if (config) {
            // 获取 setter 依赖
            setter.resolveDependencies(config, instance);
            try {
                moduleMap = loader.resolveDependentModules(config, {}, config.propDeps.concat(config.setterDeps));
            }
            catch (e) {
                return Promise.reject(e);
            }

            return injector.injectDependencies(instance, config).then(() => instance);
        }
        else {
            return Promise.resolve(instance);
        }
    }

    return Promise.all(
        ids.map(
            id => {
                let instance = this[PLUGIN_COLLECTION].beforeCreateInstance(this, id);
                if (u.isPromise(instance)) {
                    return instance;
                }

                let component = this.hasComponent(id) ? this.getComponentConfig(id) : null;
                return injector.createInstance(component)
                    .then(instance => this[PLUGIN_COLLECTION].afterCreateInstance(this, id, instance))
                    .then(task.bind(null, component));
            }
        )
    );
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
            (instance, plugin) => plugin.afterCreateInstance(ioc, componentId, instance),
            instance
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
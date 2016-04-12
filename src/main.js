/**
 * @file IoC.js IoC 容器类
 * @author exodia (d_xinxin@163.com)
 */

import Injector from './Injector';
import u  from './util';
import Ref  from './operator/Ref';
import Import from './operator/Import';
import Setter from './operator/Setter';
import List from './operator/List';
import Map from './operator/Map';
import  Loader from './Loader';

export default class IoC {
    constructor(config = {}) {
        this.loader = new Loader(this);
        config.loader && this.setLoaderFunction(config.loader);
        this.components = {};
        this.operators = {
            opImport: new Import(this),
            ref: new Ref(this),
            setter: new Setter(this),
            list: new List(this),
            map: new Map(this)
        };
        this.injector = new Injector(this);

        this.addComponent(List.LIST_COMPONENT_ID, List.LIST_COMPONENT_CONFIG);
        this.addComponent(Map.MAP_COMPONENT_ID, Map.MAP_COMPONENT_CONFIG);

        this.addComponent(config.components || {});
    }

    addComponent(id, config) {
        if (typeof id === 'string') {
            const conf = {};
            conf[id] = config;
            this.addComponent(conf);
        }
        else {
            for (const k in id) {
                if (this.hasComponent(k)) {
                    u.warn(`${k} has been add! This will be no effect`);
                    continue;
                }
                this.components[k] = createComponent.call(this, k, id[k]);
            }
        }
    }

    getComponent(ids, cb) {
        ids = ids instanceof Array ? ids : [ids];
        let moduleMap = {};

        for (let i = 0, len = ids.length; i < len; ++i) {
            const id = ids[i];
            if (!this.hasComponent(id)) {
                u.warn('`%s` has not been added to the Ioc', id);
            }
            else {
                const config = this.getComponentConfig(id);
                this.processStaticConfig(id);
                moduleMap = this.loader.resolveDependentModules(config, moduleMap, config.argDeps);
            }
        }

        this.loader.loadModuleMap(moduleMap, createInstances.bind(this, ids, cb));

        return this;
    }

    hasComponent(id) {
        return !!this.components[id];
    }

    getComponentConfig(id) {
        return id ? this.components[id] : this.components;
    }

    processStaticConfig(id) {
        const config = this.getComponentConfig(id);
        this.operators.list.process(config);
        this.operators.map.process(config);
        this.operators.opImport.process(config);
        this.operators.ref.process(config);
    }

    setLoaderFunction(amdLoader) {
        this.loader.setLoaderFunction(amdLoader);
    }

    dispose() {
        this.injector.dispose();
        this.components = null;
    }
}

function createComponent(id, config) {
    const component = {
        id,
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
    const instances = new Array(ids.length);
    if (ids.length === 0) {
        return cb.apply(null, instances);
    }

    const injector = this.injector;
    const loader = this.loader;
    const context = this;
    let moduleMap = {};
    let count = ids.length;
    const done = () => {
        --count === 0 && cb.apply(null, instances);
    };

    const task = (index, config) => instance => {
        instances[index] = instance;
        if (config) {
            // 获取 setter 依赖
            context.operators.setter.resolveDependencies(config, instance);
            moduleMap = loader.resolveDependentModules(config, {}, config.propDeps.concat(config.setterDeps));
            injector.injectDependencies(instance, config, done);

//            loader.loadModuleMap(moduleMap, u.bind(injector.injectDependencies, injector, instance, config, done));
        }
        else {
            done();
        }
    };

    for (let i = ids.length - 1; i > -1; --i) {
        const component = this.hasComponent(ids[i]) ? this.getComponentConfig(ids[i]) : null;
        injector.createInstance(component, task(i, component));
    }
}


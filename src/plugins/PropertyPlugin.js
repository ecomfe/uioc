/**
 * @file 属性插件
 * @author exodia(d_xinxin@163.com)
 */

import u from '../util';
import BasePlugin from './BasePlugin';

const CACHE = Symbol('cache');

/**
 * @private
 */
export default class PropertyPlugin extends BasePlugin {
    static getSetter(obj) {
        if (u.isObject(obj) && typeof obj.$setter === 'string') {
            return obj.$setter;
        }
    }

    static setProperty(instance, propertyName, value, setterName) {
        if (setterName) {
            return instance[setterName](value);
        }

        let method = 'set' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
        typeof instance[method] === 'function' ? instance[method](value) : (instance[propertyName] = value);
    }

    get name() {
        return 'property';
    }

    constructor() {
        super();
        this[CACHE] = Object.create(null);
    }

    /**
     * @override
     */
    afterCreateInstance(ioc, componentId, instance) {
        if (!ioc.hasComponent(componentId)) {
            return Promise.resolve(instance);
        }

        let config = ioc.getComponentConfig(componentId);
        let deps = this.resolveDependencies(ioc, componentId);
        let props = config.properties;
        return ioc.getComponent(deps).then(
            components => {
                for (let k in props) {
                    let property = props[k];
                    let value = u.hasRef(property) ? components[deps.indexOf(property.$ref)] : property;
                    PropertyPlugin.setProperty(instance, k, value, PropertyPlugin.getSetter(property));
                }
                return instance;
            }
        );
    }

    resolveDependencies(ioc, id) {
        if (this[CACHE][id]) {
            return this[CACHE][id];
        }

        let deps = this[CACHE][id] = [];
        let config = ioc.getComponentConfig(id);
        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            u.hasRef(property) && deps.push(property.$ref);
        }

        config.propDeps = deps;

        return deps;
    }
}

import u from '../util';
import BasePlugin from './BasePlugin';

const SETTER_REGEX = /^set[A-Z]/;
const SET_LENGTH = 'set'.length;
const CACHE = Symbol('cache');

export default class AutoPlugin extends BasePlugin {
    get name() {
        return 'auto';
    }

    static getPropertyFromSetter(name, descriptor) {
        let prop = null;
        if (SETTER_REGEX.test(name) && typeof descriptor.value === 'function') {
            prop = name.charAt(SET_LENGTH).toLowerCase() + name.slice(SET_LENGTH + 1);
        }

        return prop;
    }

    static setProperty(instance, propertyName, value) {
        let method = 'set' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
        instance[method](value);
    }

    constructor() {
        super();
        this[CACHE] = Object.create(null);
    }

    afterCreateInstance(ioc, id, instance) {
        let deps = this.resolveDependencies(ioc, id, instance);
        if (!deps.length) {
            return Promise.resolve(instance);
        }

        return ioc.getComponent(deps).then(
            components => {
                components.forEach(
                    (component, index) => AutoPlugin.setProperty(instance, deps[index], component)
                );
                return instance;
            }
        );
    }

    resolveDependencies(ioc, id, instance) {
        if (this[CACHE][id]) {
            return this[CACHE][id];
        }

        let config = ioc.getComponentConfig(id) || {};
        if (!config.auto) {
            this[CACHE][id] = [];
            return [];
        }

        let exclude = config.properties || {};
        let deps = [];
        let resultSet = Object.create(null);
        for (let proto = instance; proto; proto = Object.getPrototypeOf(proto)) {
            let properties = Object.getOwnPropertyNames(proto);
            properties.forEach(
                prop => {
                    if (!resultSet[prop]) {
                        resultSet[prop] = true;
                        let descriptor = Object.getOwnPropertyDescriptor(proto, prop);
                        prop = AutoPlugin.getPropertyFromSetter(prop, descriptor);
                        // 有属性，未和属性配置冲突，且组件已注册
                        prop && !u.hasOwn(exclude, prop) && ioc.hasComponent(prop) && deps.push(prop);
                    }
                }
            );
        }

        this[CACHE][id] = deps;
        config.setterDeps = deps;
        return deps;
    }
}

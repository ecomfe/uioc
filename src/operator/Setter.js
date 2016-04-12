import u from '../util';

const SETTER_REGEX = /^set[A-Z]/;
const SET_LEGTH = 'set'.length;

export default class Setter {
    constructor(context) {
        this.context = context;
    }

    resolveDependencies(config, instance) {
        if (config.setterDeps || !config.auto) {
            return config;
        }

        let exclude = config.properties || {};
        let deps = [];
        let context = this.context;
        let prop = null;


        if (typeof Object.getOwnPropertyNames === 'function' && typeof Object.getPrototypeOf === 'function') {
            let resultSet = Object.create(null);
            for (let proto = instance; proto; proto = Object.getPrototypeOf(proto)) {
                let properties = Object.getOwnPropertyNames(proto);
                for (let i = 0, len = properties.length; i < len; ++i) {
                    prop = properties[i];
                    // 去重
                    if (!resultSet[prop]) {
                        resultSet[prop] = true;
                        prop = this.getPropertyFromSetter(instance, prop);
                        prop && !u.hasOwn(exclude, prop) && context.hasComponent(prop) && deps.push(prop);
                    }
                }
            }
        }

        else {
            for (let k in instance) {
                prop = this.getPropertyFromSetter(instance, k);
                // 有属性，未和属性配置冲突，且组件已注册
                prop && !u.hasOwn(exclude, prop) && context.hasComponent(prop) && deps.push(prop);
            }
        }

        config.setterDeps = deps;
        return config;
    }

    has(obj) {
        return u.isObject(obj) && typeof obj.$setter === 'string';
    }

    getPropertyFromSetter(instance, name) {
        let prop = null;
        if (SETTER_REGEX.test(name) && typeof instance[name] === 'function') {
            prop = name.charAt(SET_LEGTH).toLowerCase() + name.slice(SET_LEGTH + 1);
        }

        return prop;
    }

    setProperty(instance, propertyName, value, setterName) {
        if (setterName) {
            return instance[setterName](value);
        }

        let method = 'set' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
        typeof instance[method] === 'function' ? instance[method](value) : (instance[propertyName] = value);

    }
}

import u from '../util';

export default class Ref {
    constructor(context) {
        this.context = context;
    }

    process(config) {
        config.argDeps = config.argDeps || this.getDependenciesFromArgs(config.args);
        config.propDeps = config.propDeps || this.getDependenciesFromProperties(config.properties);
        return config;
    }

    has(obj) {
        return u.isObject(obj) && typeof obj.$ref === 'string';
    }

    getDependenciesFromArgs(args) {
        let deps = [];
        for (let i = args.length - 1; i > -1; --i) {
            this.has(args[i]) && u.addToSet(deps, args[i].$ref);
        }
        return deps;
    }

    getDependenciesFromProperties(properties) {
        let deps = [];
        for (let k in properties) {
            if (u.hasOwn(properties, k)) {
                let prop = properties[k];
                this.has(prop) && u.addToSet(deps, prop.$ref);
            }
        }
        return deps;
    }
}

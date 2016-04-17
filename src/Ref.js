import u from './util';

export default class Ref {
    constructor(context) {
        this.context = context;
    }

    process(config) {
        config.argDeps = config.argDeps || this.getDependenciesFromArgs(config.args);
        return config;
    }

    getDependenciesFromArgs(args) {
        let deps = [];
        for (let i = args.length - 1; i > -1; --i) {
            u.hasRef(args[i]) && deps.push(args[i].$ref);
        }
        return deps;
    }
}

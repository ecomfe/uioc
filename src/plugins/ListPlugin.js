import u from '../util';
import BasePlugin from './BasePlugin';

const CACHE = Symbol('cache');

export default class ListPlugin extends BasePlugin {
    static LIST_COMPONENT_CONFIG = {
        creator(...args) {
            return args;
        },
        isFactory: true
    };

    static LIST_ID = `${Date.now()}_list`;

    static has(obj) {
        return u.isObject(obj) && obj.$list instanceof Array;
    }

    get name() {
        return 'list';
    }

    constructor() {
        super();
        this[CACHE] = Object.create(null);
    }

    /**
     * @override
     */
    onContainerInit(ioc, iocConfig) {
        ioc.addComponent(ListPlugin.LIST_ID, ListPlugin.LIST_COMPONENT_CONFIG);
        return iocConfig;
    }

    /**
     * @override
     */
    onGetComponent(ioc, id, config) {
        if (this[CACHE][id]) {
            return config;
        }

        // {$list: [{}, {}]} => {$import: List.LIST_ID, args: []}
        config.args = config.args.map(
            argConfig => ListPlugin.has(argConfig) ? {$import: ListPlugin.LIST_ID, args: argConfig.$list} : argConfig
        );

        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            if (ListPlugin.has(property)) {
                properties[k] = {$import: ListPlugin.LIST_ID, args: property.$list};
            }
        }

        this[CACHE][id] = true;
        return config;
    }
}

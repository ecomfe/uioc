/**
 * @file 数组集合插件
 * @author exodia(d_xinxin@163.com)
 */

import u from '../util';
import BasePlugin from './BasePlugin';

const CACHE = Symbol('cache');

/**
 * @private
 */
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
        ioc.addComponent(this.constructor.LIST_ID, this.constructor.LIST_COMPONENT_CONFIG);
        return iocConfig;
    }

    /**
     * @override
     */
    onGetComponent(ioc, id, config) {
        if (this[CACHE][id]) {
            return config;
        }
        
        const {has, LIST_ID} = this.constructor;
        
        // {$list: [{}, {}]} => {$import: List.LIST_ID, args: []}
        config.args = config.args.map(
            argConfig => has(argConfig) ? {$import: LIST_ID, args: argConfig.$list} : argConfig
        );

        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            if (ListPlugin.has(property)) {
                properties[k] = {$import: LIST_ID, args: property.$list};
            }
        }

        this[CACHE][id] = true;
        return config;
    }
}

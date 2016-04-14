/**
 * @file Import.js 导入操作符类
 * @author exodia(d_xinxin@163.com)
 */

import BasePlugin from './BasePlugin';
import u from '../util';

const ANONY_PREFIX = '^uioc-';
const CACHE = Symbol('cache');

export default class ImportPlugin extends BasePlugin {

    static has(obj) {
        return u.isObject(obj) && typeof obj.$import === 'string';
    }

    get name() {
        return 'import';
    }

    constructor() {
        super();
        this[CACHE] = Object.create(null);
    }

    /**
     * @override
     */
    onGetComponent(ioc, id, config) {
        if (this[CACHE][id]) {
            return config;
        }
        
        this[CACHE][id] = transformConfig(ioc, config);

        return config;
    }
}


function transformConfig(ioc, config) {
    // 解析构造函数参数
    let argConfigs = config.args;
    let id = null;
    let deps = argConfigs.reduce(
        (result, argConfig, index) => {
            if (ImportPlugin.has(argConfig)) {
                // 给匿名组件配置生成一个 ioc 构件id
                id = createAnonymousConfig(ioc, argConfig, `${config.id}-$arg.${index}.`);
                argConfigs[index] = {$ref: id};
                result.push(id);
            }
            return result;
        },
        []
    );

    // 解析属性
    let props = config.properties;
    for (let k in props) {
        if (ImportPlugin.has(props[k])) {
            id = createAnonymousConfig(ioc, props[k], `${config.id}-$prop.${k}.`);
            props[k] = {$ref: id};
            deps.push(id);
        }
    }

    return deps
}


function createAnonymousConfig(ioc, config = {}, idPrefix) {
    let importId = config.$import;
    if (!ioc.hasComponent(importId)) {
        throw new Error(`$import ${importId} component, but it is not exist, please check!!`);
    }

    let refConfig = ioc.getComponentConfig(importId);
    config.id = (idPrefix.indexOf(ANONY_PREFIX) !== -1 ? '' : ANONY_PREFIX) + idPrefix;
    config.$import = undefined;
    ioc.addComponent(config.id, {...refConfig, ...config});

    return config.id;
}


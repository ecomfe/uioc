/**
 * @file Import.js 导入操作符类
 * @author exodia(d_xinxin@163.com)
 */

import u from '../util';
const ANONY_PREFIX = '^uioc-';

export default class Import {
    constructor(context) {
        this.context = context;
    }

    process(config) {
        config.anonyDeps = config.anonyDeps || this.transformAnonymousComponents(config);
        return config;
    }

    has(obj) {
        return u.isObject(obj) && typeof obj.$import === 'string';
    }

    transformAnonymousComponents(config) {
        let deps = [];

        // 解析构造函数参数
        let args = config.args;
        let id = null;
        for (let i = args.length - 1; i > -1; --i) {
            if (this.has(args[i])) {
                // 给匿名组件配置生成一个 ioc 构件id
                id = this.createAnonymousConfig(config, args[i], `$arg.${i}.`);
                args[i] = {$ref: id};
                deps.push(id);
            }
        }

        // 解析属性
        let props = config.properties;
        for (let k in props) {
            if (this.has(props[k])) {
                id = this.createAnonymousConfig(config, props[k], `$prop.${k}.`);
                props[k] = {$ref: id};
                deps.push(id);
            }
        }

        return deps;
    }

    createAnonymousConfig(componentConfig, config, idPrefix) {
        let importId = config && config.$import;
        if (!this.context.hasComponent(importId)) {
            throw new Error('$import `%s` component, but it is not exist, please check!!', config.$import);
        }

        let refConfig = this.context.getComponentConfig(importId);
        let id = `${componentConfig.id}-${idPrefix}${importId}`;
        config.id = id = (id.indexOf(ANONY_PREFIX) !== -1 ? '' : ANONY_PREFIX) + id;
        config.$import = null;
        this.context.addComponent(id, {...refConfig, ...config});

        return id;
    }
}



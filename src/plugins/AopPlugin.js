/**
 * @file aop插件
 * @author exodia(d_xinxin@163.com)
 */

import BasePlugin from './BasePlugin';

export default class AopPlugin extends BasePlugin {
    static AOP_COMPONENT_CONFIG = {
        module: 'uaop',
        scope: 'static'
    };

    static AOP_ID = Symbol('internalAop');

    get name() {
        return 'aop';
    }

    /**
     * @override
     */
    onContainerInit(ioc, iocConfig) {
        ioc.addComponent(this.constructor.AOP_ID, this.constructor.AOP_COMPONENT_CONFIG);
        return iocConfig;
    }

    /**
     * @override
     */
    afterCreateInstance(ioc, componentId, instance) {
        let config = ioc.getComponentConfig(componentId) || {};
        if ('aopConfig' in config) {
            return ioc.getComponent(this.constructor.AOP_ID).then(
                aop => (config.aopConfig.advisors || []).reduce(
                    (instance, {matcher, advices}) => {
                        return aop.createObjectProxy(instance, matcher, advices)
                    },
                    instance
                )
            );
        }

        return Promise.resolve(instance);
    }
}

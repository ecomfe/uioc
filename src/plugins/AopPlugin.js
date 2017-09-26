/**
 * @file aop插件
 * @author exodia(d_xinxin@163.com)
 */

import BasePlugin from './BasePlugin';

/**
 * @private
 * @ignore
 */
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
     * 是否需要代理
     *
     * @param {Object} config 配置
     * @param {string} type 代理类型[class|object]
     * @return {boolean}
     */
    canProxy(config, type) {
        if (!('aopConfig' in config)) {
            return false;
        }

        // 默认代理对象为 object
        let {proxyTarget = 'object'} = config.aopConfig;
        return proxyTarget === type;
    }

    /**
     * 类或对象代理过程
     *
     * @param {IoC} ioc ioc 实例
     * @param {string} type 代理类型[class|object]
     * @param {Function} initial 待拦截的类或对象
     * @param {Array.<Object>} [advisors=[]] 切面
     * @return {Promise.<Object | Class>}
     */
    proxyAop(ioc, type, initial, advisors = []) {
        const METHOD = type === 'class' ? 'createClassProxy' : 'createObjectProxy';
        const AOP_ID = this.constructor.AOP_ID;

        return ioc.getComponent(AOP_ID).then(
            aop => advisors.reduce(
                (target, {matcher, advices}) => aop[METHOD](target, matcher, advices),
                initial
            )
        );
    }

    /**
     * @override
     */
    beforeCreateInstance(ioc, componentId, instance) {
        let config = ioc.getComponentConfig(componentId) || {};

        let proxyTarget = 'class';
        let promise = Promise.resolve();

        if (this.canProxy(config, proxyTarget)) {
            promise = this
                .proxyAop(ioc, proxyTarget, config.creator, config.aopConfig.advisors)
                .then(ProxyClass => config.creator = ProxyClass);
        }

        return promise.then(() => instance);
    }

    /**
     * @override
     */
    afterCreateInstance(ioc, componentId, instance) {
        let config = ioc.getComponentConfig(componentId) || {};
        let proxyTarget = 'object';

        return this.canProxy(config, proxyTarget)
            ? this.proxyAop(ioc, proxyTarget, instance, config.aopConfig.advisors)
            : Promise.resolve(instance);
    }
}

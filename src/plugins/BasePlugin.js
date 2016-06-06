/**
 * 基础插件类, 实现了默认的钩子接口, 继承此类实现自定义的生命周期钩子
 *
 * @implements {ILifeCircleHook}
 */
export default class BasePlugin {
    /**
     * @abstract
     */
    get name() {
        throw new Error('need to be implement');
    }

    /**
     * @see {@link ILifeCircleHook#onContainerInit}
     */
    onContainerInit(ioc, iocConfig) {
        return iocConfig;
    }

    /**
     * @see {@link ILifeCircleHook#onAddComponent}
     */
    onAddComponent(ioc, componentId, componentConfig) {
        return componentConfig;
    }

    /**
     * @see {@link ILifeCircleHook#onGetComponent}
     */
    onGetComponent(ioc, componentId, componentConfig) {
        return componentConfig;
    }

    /**
     * @see {@link ILifeCircleHook#beforeCreateInstance}
     */
    beforeCreateInstance(ioc, componentId, instance) {}

    /**
     * @see {@link ILifeCircleHook#afterCreateInstance}
     */
    afterCreateInstance(ioc, componentId, instance) {
        return Promise.resolve(instance);
    }

    /**
     * @see {@link ILifeCircleHook#onContainerDispose}
     */
    onContainerDispose(ioc) {}
}
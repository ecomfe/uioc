export default class BasePlugin {
    get name() {
        throw new Error('need to be implement');
    }

    onContainerInit(ioc, iocConfig) {
        return iocConfig;
    }

    onAddComponent(ioc, componentId, componentConfig) {
        return componentConfig;
    }

    onGetComponent(ioc, componentId, componentConfig) {
        return componentConfig;
    }

    beforeCreateInstance(ioc, componentId, instance) {

    }

    afterCreateInstance(ioc, componentId, instance) {
        return instance;
    }

    onContainerDispose(ioc) {

    }
}
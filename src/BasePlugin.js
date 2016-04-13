export default class BasePlugin {

    onContainerInit(ioc, iocConfig) {
        return iocConfig;
    }

    onAddComponent(ioc, componentId) {
        return ioc.getComponentConfig(componentId);
    }

    onGetComponent(ioc, componentId) {
        return ioc.getComponentConfig(componentId);
    }

    beforeCreateInstance(ioc, componentId, instance) {

    }

    afterCreateInstance(ioc, componentId, instance) {
        return instance;
    }

    onContainerDispose(ioc) {

    }

}
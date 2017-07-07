/**
 * 元数据定义
 */

/**
 * ioc 生命周期接口
 *
 * @interface
 */
class ILifeCircleHook {
    /**
     * 插件名称
     *
     * @type {string}
     */
    get name() {
        throw new Error('need to be implement');
    }

    /**
     * 容器实例化时调用，传入 ioc 容器和当前配置作为参数, 可以在此拦截容器级的配置，
     * 返回一个新的容器级配置提供给 ioc 使用, ioc将基于新的配置做后续操作。
     *
     * @param {IoC} ioc ioc 实例
     * @param {IoCConfig} iocConfig 容器配置
     *
     * @return {IoCConfig} 扩展后的 ioc 容器配置
     */
    onContainerInit(ioc, iocConfig) {}

    /**
     * 注册组件时调用，传入 ioc 容器，当前组件 id ，可以在此拦截组件级的配置，
     * 返回一个新的组件配置提供给 ioc 使用，ioc 将基于此配置做后续操作。
     *
     * @param {IoC} ioc ioc 实例
     * @param {string} componentId  当前待添加的组件 id
     * @param {ComponentConfig} componentConfig 当前待添加的组件配置
     *
     * @return {ComponentConfig} 扩展后的组件配置
     */
    onAddComponent(ioc, componentId, componentConfig) {}

    /**
     * 获取组件时调用，传入 ioc 容器，当前组件 id，可以在此拦截组件级的配置，
     * 返回一个新的组件配置提供给 ioc 使用，ioc 将基于此配置做后续操作。
     *
     * @param {IoC} ioc ioc 实例
     * @param {string} componentId  当前要获取的组件 id
     * @param {ComponentConfig} componentConfig 当前要获取的组件配置
     *
     * @return {ComponentConfig} 扩展后的组件配置
     */
    onGetComponent(ioc, componentId, componentConfig) {}

    /**
     * 创建组件实例前调用，传入 ioc 容器，当前组件 id，和当前已经创建的实例(可能没有)，
     * 返回一个值为实例的 promise 给 ioc 使用，若返回值不为 promise，
     * 则不会覆盖现有实例， 若最终无实例，ioc 内部将根据组件配置创建实例，ioc 将基于此做后续操作。
     *
     * @param {IoC} ioc ioc 实例
     * @param {string} componentId  当前组件 id
     * @param {*} [instance] 当前已创建的实例, 若还未创建则为 undefined
     *
     * @return {Promise<*>|undefined}
     */
    beforeCreateInstance(ioc, componentId, instance) {}

    /**
     * 创建组件实例后调用，传入 ioc 容器，当前组件 id，和当前已经创建的实例，
     * 返回一个值为实例的 promise 给 ioc 使用。
     *
     * @param {IoC} ioc ioc 实例
     * @param {string} componentId  当前组件 id
     * @param {*} instance 当前已创建的实例
     *
     * @return {Promise<*>}
     */
    afterCreateInstance(ioc, componentId, instance) {}

    /**
     * ioc 容器销毁时调用
     *
     * @param {IoC} ioc ioc 实例
     */
    onContainerDispose(ioc) {}
}


/**
 * ioc 容器配置
 *
 * @typedef {Object} IoCConfig
 *
 * @property {Function} [config.loader=require] 符合 AMD 规范的模块加载器，默认为全局的 require
 * @property {Object.<string, ComponentConfig>} [config.components]
 * 批量组件配置, 其中每个key 为组件 id，值为构建配置对象。
 *
 * @property {ILifeCircleHook[]} [config.plugins] ioc 插件
 * @property {boolean} [config.skipCheckingCircularDep=false] 是否跳过循环依赖检测
 */

/**
 * 组件配置对象
 *
 * @typedef {Object} ComponentConfig
 *
 * @property {Function|string} creator 创建组件的函数或模块名称
 * @property {boolean} [isFactory=false] 是否为工厂函数，默认false，会通过 new 方式调用，true 时直接调用
 * @property {('transient'|'singleton'|'static')} [scope='transient']
 * 组件作用域，默认为 transient，每次获取组件，都会新建一个实例返回，若为 singleton，则会返回同一个实例，若为 static，则直接返回creator
 * @property {DependencyConfig[]} args 传递给组件构造函数的参数，
 * 获取组件时，根据 args 的配置，自动创建其依赖，作为构造函数参数传入
 * @property {Object.<string, DependencyConfig>} [properties] 附加给组件实例的属性，
 * 获取组件时，IoC 会根据 properties 的配置，自动创建其依赖， 作为属性注入组件实例。
 * **note:** 若组件实例存在 ```set + 属性名首字母大些的方法```，则会调用此方法，并将依赖传入，
 * 否则简单的调用 ```this.{propertyName} = {property}```
 */

/**
 * 组件依赖配置对象，用于配置组件的依赖，若未配置$ref与$import，则本身作为依赖值，否则将根据$ref/$import的声明查找依赖。
 *
 * @typedef {* | Object} DependencyConfig
 *
 * @property {string} $ref 声明依赖的组件，获取组件时，会自动创建其声明的依赖组件并注入
 * @property {string} $import 导入指定组件的配置，将创建一个匿名组件配置，其余的配置将覆盖掉导入的配置
 * @property {DependencyConfig[]} $list 声明数组形式的依赖，获取组件时，会创建一个数组，数组元素根据其对应$list中所声明的配置进行创建
 * @property {Object<string, DependencyConfig>} $map 声明对象（映射表）形式的依赖，获取组件时，会创建一个对象，
 * 对象的属性根据其对应$map中所声明的配置进行创建
 */

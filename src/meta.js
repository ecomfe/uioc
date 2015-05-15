/**
 * 元数据定义
 */

/**
 * 构件配置对象
 *
 * @typedef {Object} ComponentConfig
 * @property {Function | string} creator 创建构件的函数或模块名称
 * @property {boolean} [isFactory=false] 是否为工厂函数，默认false，会通过 new 方式调用，true 时直接调用
 * @property {'transient' | 'singleton' | 'static'} [scope='transient']
 * 构件作用域，默认为 transient，每次获取构件，都会新建一个实例返回，若为 singleton，则会返回同一个实例，若为 static，则直接返回creator
 * @property {DependencyConfig[]} args 传递给构件构造函数的参数，
 * 获取构件时，根据 args 的配置，自动创建其依赖，作为构造函数参数传入
 * @property {Object.<string, DependencyConfig>} [properties] 附加给构件实例的属性，
 * 获取构件时，IoC 会根据 properties 的配置，自动创建其依赖， 作为属性注入构件实例。
 * **note:** 若构件实例存在 ```set + 属性名首字母大些的方法```，则会调用此方法，并将依赖传入，
 * 否则简单的调用 ```this.{propertyName} = {property}```
 * @private {Array} anonyDeps 组件的匿名依赖,禁止手动配置,容器解析时会自动填充
 * @private {Array} argDeps 组件的构造函数参数依赖,禁止手动配置,容器解析时会自动填充
 * @private {Array} propDeps 组件的属性依赖,禁止手动配置,容器解析时会自动填充
 * @private {Array} setterDeps 组件的setter依赖,禁止手动配置,容器解析时会自动填充
 */

/**
 * 构件依赖配置对象，用于配置构件的依赖，若未配置$ref与$import，则本身作为依赖值，否则将根据$ref/$import的声明查找依赖。
 *
 * @typedef {* | Object} DependencyConfig
 * @mixes ComponentConfig
 *
 * @property {string} $ref 声明依赖的构件，获取构件时，会自动创建其声明的依赖构件并注入
 * @property {string} $import 导入指定构件的配置，将创建一个匿名构件配置，其余的配置将覆盖掉导入的配置
 * @property {Array} $list 声明数组形式的依赖，获取构件时，会创建一个数组，数组元素根据其对应$list中所声明的配置进行创建
 * @property {Object} $map 声明对象（映射表）形式的依赖，获取构件时，会创建一个对象，对象的属性根据其对应$map中所声明的配置进行创建
 */

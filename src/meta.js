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
 */

/**
 * 构件依赖配置对象，用于配置构件的依赖，若未配置$ref与$import，则本身作为依赖值，否则将根据$ref/$import的声明查找依赖。
 *
 * @typedef {* | Object} DependencyConfig
 * @mixes ComponentConfig
 *
 * @property {string} [$ref] 声明依赖的构件，获取构件时，会自动创建其依赖的构件，作为构造函数参数传入
 * @property {string} [$import] 导入指定构件的配置，将创建一个匿名构件配置，其余的配置将覆盖掉导入的配置
 */
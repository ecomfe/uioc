/**
 * Created by exodia on 14-4-14.
 */
define(function () {
    function IocContainer() {

    }

    /**
     * 向容器中注册构件，配置中，args 和 properties 中的每个元素，可以使用 $ref 操作符：
     *      {
     *        args: [ { $ref: 'otherComponent' } ]
     *     }
     *
     * 容器会解析第一层的$ref，从值中获取对应的实例，若实例未注册，返回 null
     *
     *
     * 在 properties 中，可以使用 $setter 操作符：
     *      {
     *          properties: { prop1: { $setter: 'setProp1'， value: 'prop1' } }
     *      }
     * 容器会解析第一层的$setter，从值中调用实例的方法，传入属性名和属性值，
     * 若未设置 setter，则使用instance.prop1 = value方式注入值
     *
     *
     * @param {String} type
     * @param {Object} config
     * @param {Function} config.constructor 创建构件的构造函数
     * @param {Function} config.factory 创建构件的工厂函数，若同时设置了constructor，该选项无效
     * @param {*} config.literal 字面量构件，可为任意值，设置此选项，忽略其他选项
     * @param {'transient' | 'singleton'} [config.scope = 'transient']
     * 构件作用域，默认为 transient，每次获取构件，都会新建一个实例返回，若为 singleton，则会返回同一个实例
     *
     * @param {Array} config.args 传递给创建构件函数的参数
     * @param {Object} config.properties 附加给实例的属性
     *  ioc.addComponent('List', {
         *   // 构造函数创建构件 new Consctuctor
         *     constructor: require('./List'),
         *     scope: 'transient',
         *     args: [
         *          {
         *               // 依赖引用
         *               $ref: 'entityName'
         *          }
         *    ],
         *    // 属性注入， 不设置$setter, 则直接instance.xxx = xxx
         *    properties: {
         *       model: { $ref: 'ListModel' },
         *       view: { $ref: 'ListView' }
         *    }
         *  });
     *
     *
     *
     */
    IocContainer.prototype.addComponent = function (type, config) {

    };

    /**
     * 获取对应类型的实例， 会将实例作为参数传入 cb
     * @param {String} type
     * @param {Function} cb
     */
    IocContainer.prototype.getComponent = function (type, cb) {
        return null
    };

    /**
     * 销毁容器，会遍历容器中的单例，如果有设置dispose，调用他们的 dispose 方法
     */
    IocContainer.prototype.dispose = function () {

    };

    IocContainer.create = function (config) {
        var ioc = new IocContainer();
        return ioc;
    };

    function parseConfig() {

    }

    return IocContainer;
});
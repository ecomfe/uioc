/**
 * Created by exodia on 14-4-18.
 */
define(function () {
    var IocContainer = require('../../../ioc');
    var ioc = new IocContainer();
    // 构建注册
    ioc.addComponent('List', {
        // 构造函数创建构件 new Creator
        creator: require('./List'),
        // 默认 transient
        scope: 'transient',
        // 默认 true，作为构造函数调用
        isConstructor: true,
        // 参数
        args: [
            {
                // 依赖引用
                $ref: 'entityName'
            }
        ],
        // 属性注入， 不设置$setter, 直接instance.xxx = xxx
        properties: {
            model: { $ref: 'ListModel' },
            view: { $ref: 'ListView' }
        }
    });

    // 字面量注册
    ioc.addComponent('entityName', { literal: 'creative'});

    ioc.addComponent('ListModel', {
        creator: require('./ListModel'),
        properties: {
            data: {
                $ref: 'Data',
                // 方法注入，将调用 instance.addData(name, value)
                $setter: 'addData'
            },
            globalData: {  $ref: 'GlobalData', $setter: 'addData' }
        }
    });
    ioc.addComponent('ListView', {
        creator: require('./ListView'),
        properties: { template: '<ListView Template>' }
    });
    ioc.addComponent('GlobalData', {
        // 工厂方法创建构件 factoryMethod()
        creator: require('./GlobalData').getInstance,
        isConstructor: false,
        scope: 'singleton'
    });

    ioc.addComponent('Data', {
        creator: require('./Data'),
        args: ['creative', 'creativeBackend']
    });

    return ioc;
});
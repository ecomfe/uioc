/**
 * Created by exodia on 14-4-17.
 */
define(
    {
        // 构件名
        List: {
            // 构件的模块路径
            module: 'List',
            // 默认为 transient，每次获取构件，都将调用一次 creator
            scope: 'transient',

            // 将被用来创建实例的函数，falsity的值则调用模块返回的函数作为 creator
            // 若传入字符串，则将调用模块对应的方法
            // 若传入函数，则该函数作为 creator 创建实例
            // creator:

            // 传递给构造函数或工厂函数的参数
            args: [
                {
                    // 依赖 entityName 构件， 将作为参数注入
                    $ref: 'entityName'
                }
            ],
            // 属性依赖配置
            properties: {
                model: { $ref: 'ListModel' },
                view: { $ref: 'ListView' }
            }
        },
        ListModel: {
            module: 'ListModel'
        },
        ListView: {
            module: 'ListView',
            properties: { template: '<li>${name}</li>' }
        },
        entityName: {
            isFactory: true,
            creator: function () {
                return 'creative';
            }
        }
    }
);
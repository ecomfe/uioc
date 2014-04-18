/**
 * Created by exodia on 14-4-17.
 */
define(
    {
        // 构件名
        List: {
            // 构件的模块路径
            // 如果模块返回值为非函数，则认为是一个字面量，忽略除 properties之外的所有属性，并认为 scope 为’singleton’

            module: './List',
            // 是否为构造函数，默认为 true，将对 creator 使用 new 调用
            isConstructor: true,
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
            module: './ListModel',
            properties: {
                // setter 使用实例的 addData 方法
                data: { $ref: 'Data', $setter: 'addData' },
                globalData: {  $ref: 'GlobalData', $setter: 'addData' }
            }
        },
        ListView: {
            module: './ListView',
            properties: { template: '<ListView Template>' }
        },
        GlobalData: {
            module: './GlobalData',
            isConstructor: false,
            //调用 GlobalData.getInstance 方法创建实例
            creator: 'getInstance',
            // 表示单例
            scope: 'singleton'
        },
        // 等价
        // entityName: {
        //      literal: 'creative'
        // }
        entityName: 'creative',
        config: {
            literal: {

            }
        }
        // 想参考 requirejs 这样，main 会被自动调用作为入口，
        // 但是感觉这又不是 ioc 容器要干的事，丢给应用程序吧~
        /*main: {

        }*/
    }
);
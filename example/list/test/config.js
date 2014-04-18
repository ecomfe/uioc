/**
 * Created by exodia on 14-4-17.
 */
define(function () {
    var mockData = function () {
        this.entityName = 'creative';
        this.backendEntityName = 'creativeBackend';
    };

    mockData.prototype.list = function () {
        return {
            total: 1,
            data: [
                { id: 1, name: 'creative1' },
                { id: 2, name: 'creative2' }
            ]
        };
    };


    return {
        // 构件名
        List: {
            module: '../src/List',
            args: ['creative'],
            // 属性依赖配置
            properties: {
                model: { $ref: 'ListModel' },
                view: { $ref: 'ListView' }
            }
        },
        ListModel: {
            literal: {
                load: function () {
                    console.log('mock model load!')
                }
            }
        },
        ListView: {
            literal: {
                render: function () {
                    console.log('mock view render')
                }
            }
        },
        GlobalData: {
            // mock
            literal: {

            }
        },
        Data: {
            creator: mockData
        }
    }
});
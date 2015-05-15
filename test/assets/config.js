define(function (require) {
    function merge() {
        var ret = {};
        for (var i = 0, len = arguments.length; i < len; ++i) {
            var arg = arguments[i];
            for (var k in arg) {
                ret[k] = arg[k];
            }
        }

        return ret;
    }

    return function () {
        var listConfig = require('./list/config')();
        var mapConfig = require('./map/config')();
        var importConfig = require('./import/config')();
        var config = {
            components: {
                a: {
                    module: 'A',
                    args: [
                        {$ref: 'b'}
                    ]
                },
                a2: {
                    module: 'A',
                    args: [
                        {
                            $import: 'b',
                            args: [
                                'Tony Blair',
                                {$ref: 'c'}
                            ],
                            properties: {
                                util: {$ref: 'anotherUtil'}
                            }
                        }
                    ]
                },
                b: {
                    module: 'B',
                    args: [
                        'Geoff Capes',
                        {$ref: 'c'}
                    ]
                },
                b2: {
                    module: 'B',
                    args: [
                        'Tony Blair',
                        {$ref: 'c'}
                    ],
                    properties: {
                        util: {$ref: 'anotherUtil'}
                    }
                },
                b3: {
                    module: 'B',
                    properties: {
                        util: {$ref: 'myUtil'}
                    }
                },
                c: {
                    module: 'C',
                    args: ['String', 99, true, null],
                    properties: {
                        cProp: 'cProp'
                    }
                },
                c2: {
                    module: 'C',
                    args: ['String', {$ref: 'myFactory'}, true, null]
                },
                d: {
                    module: 'D',
                    properties: {
                        number: 88,
                        str: 'hi',
                        bool: false,
                        nully: null,
                        b: {$ref: 'b2'},
                        fromMethod: 'set',
                        fromMethodArray: ['one', 'two']
                    }
                },
                d2: {
                    module: 'D',
                    properties: {
                        b: {$ref: 'b'}
                    },
                    scope: 'singleton'
                },
                d3: {
                    module: 'D'
                },
                d4: {
                    module: 'D'
                },
                e: {
                    module: 'E',
                    args: [
                        {
                            str: 'str',
                            number: 77,
                            obj: {},
                            bool: true,
                            nully: null
                        }
                    ]
                },
                autoInject: {
                    module: 'AutoInject',
                    args: [
                        {$ref: 'a'},
                        {$ref: 'b'}
                    ],
                    properties: {
                        myFactory: 'myFactory',
                        anotherAutoInject: {
                            $ref: 'autoInject1'
                        }
                    },
                    auto: true
                },
                autoInject1: {
                    module: 'AutoInject1',
                    args: [
                        {$ref: 'a'},
                        {$ref: 'b'}
                    ],
                    auto: true
                },
                creatorFn: {
                    creator: function (a) {
                        this.a = a;
                    },
                    scope: 'singleton',
                    args: [
                        {$ref: 'a'}
                    ],
                    properties: {
                        b: {$ref: 'b'}
                    }
                },
                myFactory: {
                    module: 'MyFactory',
                    scope: 'singleton'
                },
                myUtil: {
                    module: 'MyUtil',
                    scope: 'singleton'
                },
                anotherUtil: {
                    module: 'MyUtil'
                },
                utilCreator: {
                    module: 'MyUtil',
                    creator: 'creator',
                    args: [
                        {$ref: 'a'},
                        {$ref: 'b'}
                    ],
                    properties: {
                        c: {$ref: 'c'}
                    }
                },
                utilFactoryCreator: {
                    module: 'MyUtil',
                    creator: 'factoryCreator',
                    isFactory: true,
                    args: [
                        {$ref: 'a'},
                        {$ref: 'b'}
                    ],
                    properties: {
                        c: {$ref: 'c'}
                    }
                },
                jquery: {
                    module: 'jquery',
                    scope: 'static'
                },
                f: {
                    module: 'F',
                    properties: {
                        $: {$ref: 'jquery'}
                    }
                },
                circular1: {
                    module: 'A',
                    properties: {
                        a: 1,
                        b: {$ref: 'circular2'}
                    }
                },
                circular2: {
                    module: 'A',
                    properties: {
                        a: 2,
                        b: {$ref: 'circular3'}
                    }
                },
                circular3: {
                    module: 'A',
                    args: [
                        {$ref: 'circular1'}
                    ],
                    properties: {
                        a: 3
                    }
                },
                x: {
                    module: 'X' //shouldn't exist
                }
            }
        };
        config.components = merge(config.components, listConfig, mapConfig, importConfig);

        return config;
    };
});
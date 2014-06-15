define(function () {
    return {
        a: {
            module: "A",
            args: [
                { $ref: 'b' }
            ]
        },
        a2: {
            module: "A",
            args: [
                { $ref: 'b2' }
            ]
        },
        b: {
            module: "B",
            args: [
                "Geoff Capes",
                { $ref: 'c' }
            ]
        },
        b2: {
            module: "B",
            args: [
                "Tony Blair",
                { $ref: 'c' }
            ]
        },
        b3: {
            module: "B",
            properties: {
                util: { $ref: 'myUtil' }
            }
        },
        c: {
            module: "C",
            args: [ "String", 99, true, null ]
        },
        c2: {
            module: "C",
            args: [ "String", { $ref: 'myFactory' }, true, null ]
        },
        d: {
            module: "D",
            properties: {
                number: 88,
                str: "hi",
                bool: false,
                nully: null,
                b: { $ref: 'b2' },
                fromMethod: 'set',
                fromMethodArray: [ "one", "two"]
            }
        },
        d2: {
            module: "D",
            properties: {
                b: { $ref: 'b' }
            },
            scope: "singleton"
        },
        d3: {
            module: "D"
        },
        d4: {
            module: "D"
        },
        e: {
            module: "E",
            args: [
                {
                    str: "str",
                    number: 77,
                    obj: {},
                    bool: true,
                    nully: null
                }
            ]
        },
        creatorFn: {
            creator: function (a) {
                this.a = a;
            },
            scope: 'singleton',
            args: [
                { $ref: 'a' }
            ],
            properties: {
                b: { $ref: 'b' }
            }
        },
        myFactory: {
            module: "MyFactory",
            scope: "singleton"
        },
        myUtil: {
            module: "MyUtil",
            scope: "singleton"
        },
        anotherUtil: {
            module: "MyUtil"
        },
        utilCreator: {
            module: 'MyUtil',
            creator: 'creator',
            args: [
                { $ref: 'a' },
                { $ref: 'b' }
            ],
            properties: {
                c: { $ref: 'c' }
            }
        },
        utilFactoryCreator: {
            module: 'MyUtil',
            creator: 'factoryCreator',
            isFactory: true,
            args: [
                { $ref: 'a' },
                { $ref: 'b' }
            ],
            properties: {
                c: { $ref: 'c' }
            }
        },
        jquery: {
            module: "jquery",
            scope: 'static'
        },
        f: {
            module: "F",
            properties: {
                $: { $ref: 'jquery' }
            }
        },
        circular1: {
            module: "A",
            properties: {
                a: 1,
                b: { $ref: 'circular2' }
            }
        },
        circular2: {
            module: "A",
            properties: {
                a: 2,
                b: { $ref: 'circular3' }
            }
        },
        circular3: {
            module: "A",
            args: [
                { $ref: 'circular1' }
            ],
            properties: {
                a: 3
            }
        },
        x: {
            module: "X" //shouldn't exist
        }
    };
});
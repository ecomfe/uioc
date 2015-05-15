define(
    function (require) {
        return function () {
            return {
                simpleList: {
                    module: 'list/A',
                    args: [
                        {
                            $list: [
                                {literalObject: 1},
                                {$ref: 'a'},
                                {$ref: 'b'},
                                'literalValue'
                            ]
                        },
                        {
                            $list: [
                                {$ref: 'a2'},
                                {$ref: 'b2'},
                                {$ref: 'autoInject'}
                            ]
                        }
                    ],
                    properties: {
                        listProp: {
                            $list: [
                                {$ref: 'myUtil'},
                                {$ref: 'b3'},
                                {$ref: 'autoInject1'}
                            ]
                        },
                        normalProp: 'normalProp'
                    }
                },
                nestList: {
                    module: 'list/A',
                    args: [
                        {
                            $list: [
                                {$list: ['literalValue', {$ref: 'a'}, {$ref: 'b'}]},
                                {$ref: 'a'},
                                {$ref: 'b'},
                                'literalValue'
                            ]
                        },
                        {
                            $list: [
                                {$ref: 'a2'},
                                {$ref: 'b2'},
                                {$list: [{$ref: 'autoInject'}, 'normalValue']}
                            ]
                        }
                    ],
                    properties: {
                        nestProp: {
                            $list: [
                                {$ref: 'myUtil'},
                                {$ref: 'b3'},
                                {$list: [{$ref: 'autoInject'}, 'normalValue']}
                            ]
                        }
                    }
                },
                importNestList: {
                    module: 'list/A',
                    args: [
                        {
                            $list: [
                                {
                                    $list: [
                                        'literalValue',
                                        {
                                            $import: 'a',
                                            properties: {importProp: 'importProp'}
                                        },
                                        {$ref: 'b'}
                                    ]
                                },
                                {
                                    $import: 'b',
                                    properties: {importProp: 'importProp'}
                                },
                                'literalValue'
                            ]
                        },
                        {
                            $list: [
                                {$ref: 'a2'},
                                {$ref: 'b2'},
                                {$list: [{$ref: 'autoInject'}, 'normalValue']}
                            ]
                        }
                    ],
                    properties: {
                        importListProp: {
                            $list: [
                                {
                                    $import: 'myUtil',
                                    properties: {prop: 'prop'}
                                },
                                {$ref: 'b3'},
                                {$list: [{$import: 'autoInject', properties: {prop: 'prop'}}, 'normalValue']}
                            ]
                        },
                        nestProp: {
                            $list: [
                                {$ref: 'myUtil'},
                                {$ref: 'b3'},
                                {$list: [{$ref: 'autoInject'}, 'normalValue']}
                            ]
                        }
                    }
                }
            };
        };
    }
);
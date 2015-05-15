define(
    function (require) {
        return function () {
            return {
                simpleMap: {
                    module: 'map/A',
                    args: [
                        {
                            $map: {
                                literalObject: {value: 1},
                                a: {$ref: 'a'},
                                b: {$ref: 'b'},
                                literalValue: 'literalValue'
                            }
                        },
                        {
                            $map: {
                                a2: {$ref: 'a2'},
                                b2: {$ref: 'b2'},
                                autoInject: {$ref: 'autoInject'}
                            }
                        }
                    ],
                    properties: {
                        mapProp: {
                            $map: {
                                myUtil: {
                                    $ref: 'myUtil'
                                },
                                b3: {
                                    $ref: 'b3'
                                },
                                autoInject1: {
                                    $ref: 'autoInject1'
                                }
                            }
                        },
                        normalProp: 'normalProp'
                    }
                },
                nestMap: {
                    module: 'map/A',
                    args: [
                        {
                            $map: {
                                mapCollection: {
                                    $map: {
                                        literalValue: 'literalValue',
                                        a: {$ref: 'a'},
                                        b: {$ref: 'b'}
                                    }
                                },
                                a: {$ref: 'a'},
                                b: {$ref: 'b'},
                                literalValue: 'literalValue'
                            }
                        },
                        {
                            $map: {
                                a2: {$ref: 'a2'},
                                b2: {$ref: 'b2'},
                                list: {$list: [{$ref: 'autoInject'}, 'normalValue']}
                            }
                        }
                    ],
                    properties: {
                        nestProp: {
                            $map: {
                                myUtil: {
                                    $ref: 'myUtil'
                                },
                                b3: {
                                    $ref: 'b3'
                                },
                                map: {
                                    $map: {
                                        list: {$list: [{$ref: 'autoInject'}, 'normalValue']}
                                    }
                                }
                            }
                        }
                    }
                },
                importNestMap: {
                    module: 'map/A',
                    args: [
                        {
                            $list: [
                                {
                                    $map: {
                                        literalValue: 'literalValue',
                                        a: {
                                            $import: 'a',
                                            properties: {importProp: 'importProp'}
                                        },
                                        b: {$ref: 'b'}
                                    }
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
                                {
                                    $map: {
                                        autoInject: {$import: 'autoInject', properties: {importProp: 'importProp'}},
                                        normalValue: 'normalValue'
                                    }
                                }
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
                                {
                                    $map: {
                                        autoInject: {$import: 'autoInject', properties: {importProp: 'importProp'}},
                                        normalValue: 'normalValue'
                                    }
                                }
                            ]
                        },
                        nestProp: {
                            $map: {
                                myUtil: {
                                    $ref: 'myUtil'
                                },
                                b3: {
                                    $ref: 'b3'
                                },
                                nestListMap: {
                                    $map: {
                                        list: {$list: [{$import: 'autoInject'}]},
                                        normalValue: 'normalValue',
                                        importUtil: {$import: 'myUtil'}
                                    }
                                }
                            }
                        }
                    }
                }
            };
        };
    }
);
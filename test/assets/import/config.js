define(
    function (require) {
        return function () {
            return {
                // import test
                importA: {
                    module: 'import/A',
                    args: [
                        {
                            $import: 'a2',
                            properties: {
                                importTest: 'importTest'
                            }
                        }
                    ],
                    properties: {
                        myUtil: {
                            $import: 'myUtil',
                            properties: {
                                importProp: 'importProp',
                                importRef: {
                                    $ref: 'utilCreator'
                                }
                            }
                        }
                    }
                },
                importNest: {
                    module: 'import/Nest',
                    args: [
                        {
                            $import: 'a',
                            properties: {
                                util: {
                                    $import: 'myUtil',
                                    args: [
                                        {
                                            $import: 'a',
                                            properties: {
                                                argImportProp: 'argImportProp',
                                                d3: {
                                                    $import: 'd3',
                                                    properties: {
                                                        d3Prop: 'd3Prop'
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                    properties: {
                                        importProp: 'importProp'
                                    }
                                }
                            }
                        },
                        {
                            $import: 'f'
                        },
                        {
                            $import: 'f',
                            properties: {
                                repeatImport: 'repeatImport'
                            }
                        }
                    ],
                    properties: {
                        c: {
                            $import: 'c',
                            properties: {
                                cProp: 'nestProp'
                            }
                        },
                        c1: {
                            $import: 'c',
                            properties: {
                                repeatImport: 'repeatImport'
                            }
                        }
                    },
                    scope: 'singleton',
                    auto: true
                }
            };
        };
    }
);
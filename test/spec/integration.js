describe('Ioc Integration Test', function () {
    var iocInstance = null;

    function assertInstanceOf(Constructor, instance) {
        expect(instance instanceof Constructor).toBe(true);
    }

    function assertSame(a, b) {
        expect(a).toBe(b);
    }

    function assertEqual(a, b) {
        expect(a).toEqual(b);
    }

    function assertNull(v) {
        expect(v).toBeNull();
    }

    beforeEach(function (done) {
        require(['ioc', 'config'], function (IOC, config) {
            iocInstance = IOC();
            iocInstance.addComponent(config);
            done();
        });
    });

    it('simpleInstance', function (done) {

        iocInstance.getComponent('a', function (a) {
            require(['A'], function (A) {
                assertInstanceOf(A, a);
                done();
            });
        });
    });

    it('multiInstantiate', function (done) {

        iocInstance.getComponent(['a', 'b', 'c'], function (a, b, c) {

            require(['A', 'B', 'C'], function (A, B, C) {

                assertInstanceOf(A, a);
                assertInstanceOf(B, b);
                assertInstanceOf(C, c);

                done();
            });
        });
    });

    it('simpleInstanceNull', function (done) {

        iocInstance.getComponent(['a', 'b', 'z'], function (a, b, z) {
            require(['A', 'B'], function (A, B) {
                assertInstanceOf(A, a);
                assertInstanceOf(B, b);
                assertNull(z);
                done();
            });
        });
    });

    it('singletonInstance', function (done) {
        iocInstance.getComponent('myFactory', function (myFactory1) {
            iocInstance.getComponent('myFactory', function (myFactory2) {
                require(['MyFactory'], function (MyFactory) {
                    assertInstanceOf(MyFactory, myFactory1);
                    assertSame(myFactory1, myFactory2);
                });
                done()
            })
        })
    });

    it('simpleConstructorInjectLiterals', function (done) {

        iocInstance.getComponent('c', function (c) {
            assertSame(c.str, 'String');
            assertSame(c.number, 99);
            assertSame(c.bool, true);
            expect(c.nully).toBeNull();
            done();
        });
    });

    it('simpleConstructorInjectDependency', function (done) {

        iocInstance.getComponent(['a', 'a2'], function (a, a2) {
            require(['A', 'B', 'C'], function (A, B, C) {

                assertInstanceOf(A, a);
                assertInstanceOf(A, a2);

                assertInstanceOf(B, a.b);
                assertInstanceOf(B, a2.b);

                assertInstanceOf(C, a.b.c);
                assertInstanceOf(C, a2.b.c);

                assertSame(a.b.c.str, 'String');
                assertSame(a.b.c.number, 99);
                assertSame(a.b.c.bool, true);
                assertNull(a.b.c.nully);

                done();
            });
        });
    });

    it('simplePropertyInjectLiterals', function (done) {

        iocInstance.getComponent('d', function (d) {

            assertSame(d.str, 'hi');
            assertSame(d.number, 88);
            assertSame(d.bool, false);
            assertNull(d.nully);
            assertSame(d.fromMethod, 'set');
            assertEqual(d.fromMethodArray, ['one', 'two']);

            done();
        });
    });

    it('simplePropertyInjectDependency', function (done) {

        iocInstance.getComponent('d', function (d) {

            require(['A', 'B', 'C', 'D' ], function (A, B, C, D) {

                assertInstanceOf(D, d);

                assertInstanceOf(B, d.b);

                assertInstanceOf(C, d.b.c);

                assertSame(d.b.c.str, 'String');
                assertSame(d.b.c.number, 99);
                assertSame(d.b.c.bool, true);
                assertNull(d.b.c.nully);

                done();
            });
        });
    });

    it('Simple Creator Function', function (done) {
        iocInstance.getComponent('creatorFn', function (creatorFn) {
            require(['A', 'B'], function (A, B) {
                assertInstanceOf(A, creatorFn.a);
                assertInstanceOf(B, creatorFn.b);
                creatorFn.dispose = function () {};
                spyOn(creatorFn, 'dispose');
                iocInstance.dispose();
                expect(creatorFn.dispose).toHaveBeenCalled();
                done();
            });
        });
    });

    it('utilsInject', function (done) {

        iocInstance.getComponent('b3', function (b3) {
            assertSame(b3.useUtil(), true);

            done();
        })
    });

    it('jquery', function (done) {
        iocInstance.getComponent('f', function (f) {

            assertSame(f.isNumber(999), true);
            assertSame(f.isNumber('NaN'), false);

            done();
        });
    });

    it('circularError', function () {
        expect(function () {
            iocInstance.getComponent('circular1', function (circular1) {})
        }).toThrow();
    });

    /* it('circularAllowed', 1, function (done) {

     iocInstance.allowCircular = true;
     iocInstance.getComponent('circular1', function (circular1) {
     assertTrue(true);
     done();
     });
     });*/
});
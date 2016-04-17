import IoC from 'ioc';
import CircularError from 'ioc/CircularError';
import A from 'A';
import B from 'B';
import C from 'C';
import D from 'D';
import MyUtil from 'MyUtil';
import MyFactory from 'MyFactory';
import config from 'config';

describe('Ioc Integration Test: ', () => {
    let iocInstance = null;

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

    beforeEach(() => iocInstance = new IoC(config()));

    it('customLoader', done => {
        let calledWidthArgs = {};
        iocInstance = new IoC();
        iocInstance.addComponent(config().components);
        iocInstance.setLoaderFunction(
            (...args) => {
                calledWidthArgs[args[0][0]] = 1;
                return require(...args);
            }
        );
        iocInstance.getComponent('myFactory').then(
            myFactory => {
                assertInstanceOf(MyFactory, myFactory);
                expect(calledWidthArgs.MyFactory).toBe(1);
                done();
            }
        );
    });

    it('simpleInstance', done => {
        iocInstance.getComponent('a').then(
            a => {
                assertInstanceOf(A, a);
                done();
            }
        );
    });

    it('multiInstantiate', done => {
        iocInstance.getComponent(['a', 'b', 'c']).then(
            ([a, b, c]) => {
                assertInstanceOf(A, a);
                assertInstanceOf(B, b);
                assertInstanceOf(C, c);
                done();
            }
        );
    });

    it('simpleInstanceNull', done => {
        iocInstance.getComponent(['a', 'b', 'z']).then(
            ([a, b, z]) => {
                assertInstanceOf(A, a);
                assertInstanceOf(B, b);
                assertNull(z);
                done();
            }
        );
    });

    it('singletonInstance', done => {
        iocInstance.getComponent('myFactory').then(
            factory1 => iocInstance.getComponent('myFactory')
                .then(factory2 => [factory1, factory2])
        ).then(
            ([myFactory1, myFactory2]) => {
                assertInstanceOf(MyFactory, myFactory1);
                assertSame(myFactory1, myFactory2);
                done()
            }
        );
    });

    it('simpleConstructorInjectLiterals', done => {
        iocInstance.getComponent('c').then(
            c => {
                assertSame(c.str, 'String');
                assertSame(c.number, 99);
                assertSame(c.bool, true);
                expect(c.nully).toBeNull();
                done();
            }
        );
    });

    it('simpleConstructorInjectDependency', done => {
        iocInstance.getComponent(['a', 'a2']).then(
            ([a, a2]) => {
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
                expect(a.b.c.cProp).toBe('cProp');

                done();
            }
        );
    });

    it('simplePropertyInjectLiterals', done => {

        iocInstance.getComponent('d').then(
            d => {
                assertSame(d.str, 'hi');
                assertSame(d.number, 88);
                assertSame(d.bool, false);
                assertNull(d.nully);
                assertSame(d.fromMethod, 'set');
                assertEqual(d.fromMethodArray, ['one', 'two']);

                done();
            }
        );
    });

    it('simplePropertyInjectDependency', done => {

        iocInstance.getComponent('d').then(
            d => {
                assertInstanceOf(D, d);
                assertInstanceOf(B, d.b);
                assertInstanceOf(C, d.b.c);

                assertSame(d.b.c.str, 'String');
                assertSame(d.b.c.number, 99);
                assertSame(d.b.c.bool, true);
                assertNull(d.b.c.nully);
                assertSame(d.b.name, 'Tony Blair');

                assertInstanceOf(MyUtil, d.b.util);

                done();
            }
        );
    });

    it('Simple Creator Function', done => {
        iocInstance.getComponent('creatorFn').then(
            creatorFn => {
                assertInstanceOf(A, creatorFn.a);
                assertInstanceOf(B, creatorFn.b);
                creatorFn.dispose = () => {};
                spyOn(creatorFn, 'dispose');
                iocInstance.dispose();
                expect(creatorFn.dispose).toHaveBeenCalled();
                done();
            }
        );
    });

    it('utilsInject', done => {
        iocInstance.getComponent('b3').then(
            b3 => {
                assertSame(b3.useUtil(), true);
                done();
            }
        );
    });

    it('utilCreator', done => {
        iocInstance.getComponent('utilCreator').then(
            utilCreator => {
                assertInstanceOf(MyUtil.creator, utilCreator);
                assertInstanceOf(A, utilCreator.a);
                assertInstanceOf(B, utilCreator.b);
                assertInstanceOf(C, utilCreator.c);
                done();
            }
        );
    });

    it('utilFactoryCreator', done => {
        iocInstance.getComponent('utilFactoryCreator').then(
            utilFactoryCreator => {
                expect(utilFactoryCreator.constructor).toBe(Object);
                assertInstanceOf(A, utilFactoryCreator.a);
                assertInstanceOf(B, utilFactoryCreator.b);
                assertInstanceOf(C, utilFactoryCreator.c);
                done();
            }
        );
    });

    it('jquery', done => {
        iocInstance.getComponent('f').then(
            f => {
                assertSame(f.isNumber(999), true);
                assertSame(f.isNumber('NaN'), false);
                done();
            }
        );
    });

    it('circularError', done => {
        iocInstance.getComponent('circular1').catch(
            e => {
                expect(e instanceof CircularError);
                // expect(e.message).toBe('circular1 has circular dependencies ');
                done();
            }
        );
    });

    /* it('circularAllowed', 1, function (done) {

     iocInstance.allowCircular = true;
     iocInstance.getComponent('circular1', function (circular1) {
     assertTrue(true);
     done();
     });
     });*/
});
import IoC from 'ioc';
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

    it('customLoader', async done => {
        let calledWidthArgs = {};
        iocInstance = new IoC();
        iocInstance.addComponent(config().components);
        iocInstance.setLoaderFunction(
            (...args) => {
                calledWidthArgs[args[0][0]] = 1;
                return require(...args);
            }
        );
        let myFactory = await iocInstance.getComponent('myFactory');
        assertInstanceOf(MyFactory, myFactory);
        expect(calledWidthArgs.MyFactory).toBe(1);
        done();
    });

    it('simpleInstance', async done => {
        let a = await iocInstance.getComponent('a');
        assertInstanceOf(A, a);
        done();
    });

    it('multiInstantiate', async done => {
        let [a, b, c] = await iocInstance.getComponent(['a', 'b', 'c']);
        assertInstanceOf(A, a);
        assertInstanceOf(B, b);
        assertInstanceOf(C, c);
        done();
    });

    it('simpleInstanceNull', async done => {
        let [a, b] = await iocInstance.getComponent(['a', 'b']);
        assertInstanceOf(A, a);
        assertInstanceOf(B, b);
        done();
    });

    it('singletonInstance', async done => {
        let [factory1, factory2] = await iocInstance.getComponent(['myFactory', 'myFactory']);
        assertInstanceOf(MyFactory, factory1);
        assertSame(factory1, factory2);
        done();
    });

    it('simpleConstructorInjectLiterals', async done => {
        let c = await iocInstance.getComponent('c');
        assertSame(c.str, 'String');
        assertSame(c.number, 99);
        assertSame(c.bool, true);
        expect(c.nully).toBeNull();
        done();
    });

    it('simpleConstructorInjectDependency', async done => {
        let [a, a2] = await iocInstance.getComponent(['a', 'a2']);
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
    });

    it('simplePropertyInjectLiterals', async done => {
        let d = await iocInstance.getComponent('d');
        assertSame(d.str, 'hi');
        assertSame(d.number, 88);
        assertSame(d.bool, false);
        assertNull(d.nully);
        assertSame(d.fromMethod, 'set');
        assertEqual(d.fromMethodArray, ['one', 'two']);

        done();
    });

    it('simplePropertyInjectDependency', async done => {
        let d = await iocInstance.getComponent('d');
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
    });

    it('Simple Creator Function', async done => {
        let creatorFn = await iocInstance.getComponent('creatorFn');
        assertInstanceOf(A, creatorFn.a);
        assertInstanceOf(B, creatorFn.b);
        creatorFn.dispose = () => {};
        spyOn(creatorFn, 'dispose');
        iocInstance.dispose();
        expect(creatorFn.dispose).toHaveBeenCalled();
        done();
    });

    it('utilsInject', async done => {
        let b3 = await iocInstance.getComponent('b3');
        assertSame(b3.useUtil(), true);
        done();
    });

    it('utilCreator', async done => {
        let utilCreator = await iocInstance.getComponent('utilCreator');
        assertInstanceOf(MyUtil.creator, utilCreator);
        assertInstanceOf(A, utilCreator.a);
        assertInstanceOf(B, utilCreator.b);
        assertInstanceOf(C, utilCreator.c);
        done();
    });

    it('utilFactoryCreator', async done => {
        let utilFactoryCreator = await iocInstance.getComponent('utilFactoryCreator');
        expect(utilFactoryCreator.constructor).toBe(Object);
        assertInstanceOf(A, utilFactoryCreator.a);
        assertInstanceOf(B, utilFactoryCreator.b);
        assertInstanceOf(C, utilFactoryCreator.c);
        done();
    });

    it('should return the same and right object when scope is static ', async done => {
        let [f1, f2] = await iocInstance.getComponent(['f', 'f']);
        assertSame(f1.isNumber(999), true);
        assertSame(f1.isNumber('NaN'), false);
        assertSame(f1.$, f2.$);
        done();
    });

    it('circularError', async done => {
        try {
            await iocInstance.getComponent('circular1');
        }
        catch (e) {
            expect(e.message).toBe('circular3 has circular dependencies ');
            done();
        }
    });

    it('should throw error when add an existing component', done => {
        let id = Symbol('id');
        iocInstance.addComponent(id, {creator: Object});
        try {
            iocInstance.addComponent(id, {creator: Object});
        }
        catch (e) {
            expect(e.message).toBe(`${String(id)} has been added!`);
            done();
        }
    });

    it('should return a rejected promise when getting an non-existing component', async done => {
        try {
            await iocInstance.getComponent('z');
        }
        catch (e) {
            expect(e.message).toBe(`\`z\` has not been added to the Ioc`);
            done();
        }
    });

    /* it('circularAllowed', 1, function (done) {

     iocInstance.allowCircular = true;
     iocInstance.getComponent('circular1', function (circular1) {
     assertTrue(true);
     done();
     });
     });*/
});
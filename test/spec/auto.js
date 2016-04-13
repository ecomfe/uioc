import IoC from 'ioc';
import A from 'A';
import B from 'B';
import C from 'C';
import D from 'D';
import MyUtil from 'MyUtil';
import AutoInject from 'AutoInject';
import AutoInject1 from 'AutoInject1';
import MyFactory from 'MyFactory';
import config from 'config';

describe('auto inject test', () => {

    function assertInstanceOf(Constructor, instance) {
        expect(instance instanceof Constructor).toBe(true);
    }

    function assertNull(v) {
        expect(v).toBeNull();
    }

    let iocInstance = null;
    beforeEach(() => iocInstance = new IoC(config()));

    it('normal inject', done => {
        spyOn(AutoInject.prototype, 'setd');
        spyOn(AutoInject.prototype, 'settest');
        iocInstance.getComponent('autoInject').then(
            autoInject => {
                assertInstanceOf(A, autoInject.a);
                assertInstanceOf(B, autoInject.b);
                assertInstanceOf(C, autoInject.c);
                assertInstanceOf(D, autoInject.d);
                assertInstanceOf(MyUtil, autoInject.d.b.util);

                assertNull(autoInject.e);
                expect(autoInject.setd).not.toHaveBeenCalled();
                expect(autoInject.settest).not.toHaveBeenCalled();

                let anotherInject = autoInject.anotherAutoInject;
                assertInstanceOf(AutoInject, anotherInject);
                assertInstanceOf(AutoInject1, anotherInject);
                assertInstanceOf(A, anotherInject.a);
                assertInstanceOf(B, anotherInject.b);
                assertInstanceOf(C, anotherInject.c);
                assertInstanceOf(D, anotherInject.d);
                assertInstanceOf(MyUtil, anotherInject.d.b.util);

                assertNull(anotherInject.e);
                done();
            }
        );
    });

    it('setter and property priority', done => {
        iocInstance.getComponent('autoInject').then(
            autoInject => {
                expect(autoInject.myFactory).toBe('myFactory');
                expect(autoInject.setCCalledCount).toBe(1);
                assertInstanceOf(MyFactory, autoInject.anotherAutoInject.myFactory);
                done();
            }
        );
    });

    it('setter dependency which has no register', done => {
        spyOn(AutoInject.prototype, 'setUnRegisterComponent');
        iocInstance.getComponent('autoInject').then(
            autoInject => {
                expect(autoInject.setUnRegisterComponent).not.toHaveBeenCalled();
                done();
            }
        );
    });

});
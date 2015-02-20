describe('auto inject test', function () {

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

    var iocInstance = null;
    beforeEach(function (done) {
        require(['ioc', 'config'], function (IoC, config) {
            iocInstance = IoC(config());
            done();
        });
    });

    it('normal inject', function (done) {
        require(['A', 'B', 'C', 'D', 'MyUtil', 'AutoInject', 'AutoInject1'],
            function (A, B, C, D, Util, AutoInject, AutoInject1) {
                spyOn(AutoInject.prototype, 'setd');
                spyOn(AutoInject.prototype, 'settest');
                iocInstance.getComponent('autoInject', function (autoInject) {

                    assertInstanceOf(A, autoInject.a);
                    assertInstanceOf(B, autoInject.b);
                    assertInstanceOf(C, autoInject.c);
                    assertInstanceOf(D, autoInject.d);
                    assertInstanceOf(Util, autoInject.d.b.util);

                    assertNull(autoInject.e);
                    expect(autoInject.setd).not.toHaveBeenCalled();
                    expect(autoInject.settest).not.toHaveBeenCalled();

                    var anotherInject = autoInject.anotherAutoInject;
                    assertInstanceOf(AutoInject, anotherInject);
                    assertInstanceOf(AutoInject1, anotherInject);
                    assertInstanceOf(A, anotherInject.a);
                    assertInstanceOf(B, anotherInject.b);
                    assertInstanceOf(C, anotherInject.c);
                    assertInstanceOf(D, anotherInject.d);
                    assertInstanceOf(Util, anotherInject.d.b.util);

                    assertNull(anotherInject.e);
                    done();
                });
            });
    });

    it('setter and property priority', function (done) {
        iocInstance.getComponent('autoInject', function (autoInject) {
            require(['MyFactory'], function (MyFactory) {
                expect(autoInject.myFactory).toBe('myFactory');
                expect(autoInject.setCCalledCount).toBe(1);
                assertInstanceOf(MyFactory, autoInject.anotherAutoInject.myFactory);
                done();
            });
        });
    });

    it('setter dependency which has no register', function (done) {
        require(['AutoInject'], function (AutoInject) {
            spyOn(AutoInject.prototype, 'setUnRegisterComponent');
            iocInstance.getComponent('autoInject', function (autoInject) {
                expect(autoInject.setUnRegisterComponent).not.toHaveBeenCalled();
                done();
            });
        });
    });

});
describe('import test', function () {
    var iocInstance = null;
    beforeEach(function (done) {
        require(['ioc', 'config'], function (IoC, config) {
            iocInstance = IoC(config);
            done();
        });
    });


    it('simple import', function (done) {
        iocInstance.getComponent('importA', function (importIns) {
            require(['import/A', 'A', 'B', 'C', 'MyUtil'], function (ImportA, A, B, C, MyUtil) {
                var obj = importIns.obj;
                expect(obj instanceof A).toBe(true);
                expect(obj.importTest).toBe('importTest');
                expect(obj.b instanceof B).toBe(true);
                expect(obj.b.name).toBe('Tony Blair');
                expect(obj.b.c instanceof C).toBe(true);
                expect(obj.util instanceof MyUtil).toBe(true);

                var myUtil = obj.myUtil;
                expect(myUtil instanceof MyUtil).toBe(true);
                expect(myUtil.importProp).toBe('importProp');

                var importRef = myUtil.importRef;
                expect(importRef instanceof MyUtil.creator).toBe(true);
                expect(importRef.a instanceof A).toBe(true);
                expect(importRef.b instanceof B).toBe(true);

                done();
            });
        });
    });

    it('nested import', function (done) {

    });


});
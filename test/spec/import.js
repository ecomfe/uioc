describe('import test: ', function () {
    var iocInstance = null;
    beforeEach(function (done) {
        require(['ioc', 'config'], function (IoC, config) {
            iocInstance = IoC(config());
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
                expect(obj.b.util instanceof MyUtil).toBe(true);

                var myUtil = importIns.myUtil;
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
        iocInstance.getComponent('importNest', function (nest) {
            require(['import/Nest', 'A', 'MyUtil', 'D', 'F', 'C'], function (Nest, A, MyUtil, D, F, C) {
                expect(nest instanceof Nest).toBe(true);
                expect(nest.f instanceof F).toBe(true);
                expect(nest.f1 instanceof F).toBe(true);
                expect(nest.f1.repeatImport).toBe('repeatImport');

                expect(nest.c instanceof C).toBe(true);
                expect(nest.c1 instanceof C).toBe(true);
                expect(nest.c.cProp).toBe('nestProp');
                expect(nest.c1.repeatImport).toBe('repeatImport');

                var a = nest.obj;
                expect(a instanceof A).toBe(true);
                expect(a.util instanceof MyUtil).toBe(true);
                expect(a.util.importProp).toBe('importProp');

                var utilObj = a.util.obj;
                expect(utilObj instanceof A).toBe(true);
                expect(utilObj.argImportProp).toBe('argImportProp');

                var utilObjD3 = utilObj.d3;
                expect(utilObjD3 instanceof D).toBe(true);
                expect(utilObjD3.d3Prop).toBe('d3Prop');

                done();
            });
        });
    });

    it('nested import with auto and singleton', function (done) {
        iocInstance.getComponent('importNest', function (nest1) {
            iocInstance.getComponent('importNest', function (nest2) {
                require(['import/A', 'D'], function (ImportA, D) {
                    expect(nest1).toBe(nest2);
                    expect(nest1.importA instanceof ImportA).toBe(true);
                    expect(nest1.d instanceof D).toBe(true);
                    expect(nest1.isNumber(1)).toBe(true);

                    done();
                });
            });
        });
    });
});

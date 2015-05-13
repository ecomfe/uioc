describe('list test: ', function () {
    var iocInstance = null;
    beforeEach(function (done) {
        require(['ioc', 'config'], function (IoC, config) {
            iocInstance = IoC(config());
            done();
        });
    });

    it('simple list', function (done) {
        iocInstance.getComponent('simpleList', function (simpleList) {
            require(
                ['list/A', 'A', 'B', 'C', 'MyUtil', 'AutoInject', 'AutoInject1'],
                function (ListA, A, B, C, MyUtil, AutoInject, AutoInject1) {
                    expect(simpleList instanceof ListA).toBe(true);

                    var listArg1 = simpleList.listArg1;
                    var listArg2 = simpleList.listArg2;
                    expect(listArg1 instanceof Array).toBe(true);
                    expect(listArg1.length).toBe(4);
                    expect(listArg1[0]).toEqual({literalObject: 1});
                    expect(listArg1[1] instanceof A).toBe(true);
                    expect(listArg1[2] instanceof B).toBe(true);
                    expect(listArg1[3]).toBe('literalValue');

                    expect(listArg2 instanceof Array).toBe(true);
                    expect(listArg2.length).toBe(3);
                    expect(listArg2[0] instanceof A).toBe(true);
                    expect(listArg2[1] instanceof B).toBe(true);
                    expect(listArg2[2] instanceof AutoInject).toBe(true);

                    var listProp = simpleList.listProp;
                    expect(listProp instanceof Array).toBe(true);
                    expect(listProp.length).toBe(3);
                    expect(listProp[0] instanceof MyUtil).toBe(true);
                    expect(listProp[1] instanceof B).toBe(true);

                    // myUtil is singleton
                    expect(listProp[1].util).toBe(listProp[0]);
                    expect(listProp[2] instanceof AutoInject1).toBe(true);

                    done();
                });
        });
    });

    it('nest list', function (done) {
        iocInstance.getComponent('nestList', function (nestList) {
            require(
                ['list/A', 'A', 'B', 'AutoInject', 'MyUtil'],
                function (ListA, A, B, AutoInject, MyUtil) {
                    expect(nestList instanceof ListA).toBe(true);

                    var listArg1 = nestList.listArg1;
                    var listArg2 = nestList.listArg2;
                    expect(listArg1 instanceof Array).toBe(true);
                    expect(listArg1.length).toBe(4);
                    expect(listArg1[1] instanceof A).toBe(true);
                    expect(listArg1[1].b instanceof B).toBe(true);

                    expect(listArg1[2] instanceof B).toBe(true);
                    expect(listArg1[3]).toBe('literalValue');

                    // nest list
                    var list = listArg1[0];
                    expect(list[0]).toBe('literalValue');
                    expect(list[1] instanceof A).toBe(true);
                    expect(list[2] instanceof B).toBe(true);

                    expect(listArg2 instanceof Array).toBe(true);
                    expect(listArg2.length).toBe(3);
                    expect(listArg2[0] instanceof A).toBe(true);
                    expect(listArg2[1] instanceof B).toBe(true);

                    // nest list
                    list = listArg2[2];
                    expect(list[0] instanceof AutoInject).toBe(true);
                    expect(list[1]).toBe('normalValue');


                    var listProp = nestList.nestProp;
                    expect(listProp instanceof Array).toBe(true);
                    expect(listProp.length).toBe(3);
                    expect(listProp[0] instanceof MyUtil).toBe(true);
                    expect(listProp[1] instanceof B).toBe(true);

                    list = listProp[2];
                    expect(list[0] instanceof AutoInject).toBe(true);
                    expect(list[1]).toBe('normalValue');

                    done();
                });
        });
    });

    it('nest list with import', function (done) {
        iocInstance.getComponent('importNestList', function (importNestList) {
            require(
                ['list/A', 'A', 'B', 'AutoInject', 'MyUtil'],
                function (ListA, A, B, AutoInject, MyUtil) {
                    expect(importNestList instanceof ListA).toBe(true);

                    var listArg1 = importNestList.listArg1;
                    expect(listArg1 instanceof Array).toBe(true);
                    expect(listArg1.length).toBe(3);
                    expect(listArg1[2]).toBe('literalValue');
                    expect(listArg1[1] instanceof B).toBe(true);
                    expect(listArg1[1].importProp).toBe('importProp');

                    var list = listArg1[0];
                    expect(list[0]).toBe('literalValue');
                    expect(list[1] instanceof A).toBe(true);
                    expect(list[1].importProp).toBe('importProp');
                    expect(list[2] instanceof B).toBe(true);

                    var listProp = importNestList.nestProp;
                    expect(listProp instanceof Array).toBe(true);
                    expect(listProp.length).toBe(3);
                    expect(listProp[0] instanceof MyUtil).toBe(true);
                    expect(listProp[1] instanceof B).toBe(true);
                    list = listProp[2];
                    expect(list[0] instanceof AutoInject).toBe(true);
                    expect(list[1]).toBe('normalValue');

                    var nestProp = importNestList.importListProp;
                    expect(nestProp[0] instanceof MyUtil).toBe(true);
                    expect(nestProp[0].prop).toBe('prop');
                    expect(nestProp[1] instanceof B).toBe(true);

                    list = nestProp[2];
                    expect(list[0] instanceof AutoInject).toBe(true);
                    expect(list[0].prop).toBe('prop');
                    expect(list[1]).toBe('normalValue');

                    done();
                });
        });

    });
});

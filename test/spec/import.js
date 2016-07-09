import {IoC} from 'ioc';
import A from 'A';
import B from 'B';
import C from 'C';
import D from 'D';
import F from 'F';
import MyUtil from 'MyUtil';
import ImportA from 'import/A';
import Nest from 'import/Nest';

import config from 'config';

describe('import test: ', () => {
    let iocInstance = null;
    beforeEach(() => iocInstance = new IoC(config()));


    it('simple import', done => {
        iocInstance.getComponent('importA').then(
            importIns => {
                let obj = importIns.obj;
                expect(obj instanceof A).toBe(true);
                expect(obj.importTest).toBe('importTest');
                expect(obj.b instanceof B).toBe(true);
                expect(obj.b.name).toBe('Tony Blair');
                expect(obj.b.c instanceof C).toBe(true);
                expect(obj.b.util instanceof MyUtil).toBe(true);

                let myUtil = importIns.myUtil;
                expect(myUtil instanceof MyUtil).toBe(true);
                expect(myUtil.importProp).toBe('importProp');

                let importRef = myUtil.importRef;
                expect(importRef instanceof MyUtil.creator).toBe(true);
                expect(importRef.a instanceof A).toBe(true);
                expect(importRef.b instanceof B).toBe(true);

                done();
            }
        );
    });

    it('nested import', done => {
        iocInstance.getComponent('importNest').then(
            nest => {
                expect(nest instanceof Nest).toBe(true);
                expect(nest.f instanceof F).toBe(true);
                expect(nest.f1 instanceof F).toBe(true);
                expect(nest.f1.repeatImport).toBe('repeatImport');

                expect(nest.c instanceof C).toBe(true);
                expect(nest.c1 instanceof C).toBe(true);
                expect(nest.c.cProp).toBe('nestProp');
                expect(nest.c1.repeatImport).toBe('repeatImport');

                let a = nest.obj;
                expect(a instanceof A).toBe(true);
                expect(a.util instanceof MyUtil).toBe(true);
                expect(a.util.importProp).toBe('importProp');

                let utilObj = a.util.obj;
                expect(utilObj instanceof A).toBe(true);
                expect(utilObj.argImportProp).toBe('argImportProp');

                let utilObjD3 = utilObj.d3;
                expect(utilObjD3 instanceof D).toBe(true);
                expect(utilObjD3.d3Prop).toBe('d3Prop');

                done();
            }
        );
    });

    it('nested import with auto and singleton', done => {
        iocInstance.getComponent('importNest').then(
            nest1 => iocInstance.getComponent('importNest').then(nest2 => [nest1, nest2])
        ).then(([nest1, nest2]) => {
            expect(nest1).toBe(nest2);
            expect(nest1.importA instanceof ImportA).toBe(true);
            expect(nest1.d instanceof D).toBe(true);
            expect(nest1.isNumber(1)).toBe(true);

            done();
        });
    });

    it('nested parallel import with auto and singleton', done => {
        Promise.all([
            iocInstance.getComponent('importNest'),
            iocInstance.getComponent('importNest')
        ]).then(([nest1, nest2]) => {
            expect(nest1).toBe(nest2);
            expect(nest1.importA instanceof ImportA).toBe(true);
            expect(nest1.d instanceof D).toBe(true);
            expect(nest1.isNumber(1)).toBe(true);

            done();
        });
    })
});

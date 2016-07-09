import {IoC} from 'ioc';
import A from 'A';
import B from 'B';
import MyUtil from 'MyUtil';
import ListA from 'list/A';
import AutoInject from 'AutoInject';
import AutoInject1 from 'AutoInject1';
import config from 'config';

describe('list test: ', () => {
    let iocInstance = null;
    beforeEach(() => iocInstance = new IoC(config()));

    it('simple list', done => {
        iocInstance.getComponent('simpleList').then(
            simpleList => {
                expect(simpleList instanceof ListA).toBe(true);

                let listArg1 = simpleList.listArg1;
                let listArg2 = simpleList.listArg2;
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

                let listProp = simpleList.listProp;
                expect(listProp instanceof Array).toBe(true);
                expect(listProp.length).toBe(3);
                expect(listProp[0] instanceof MyUtil).toBe(true);
                expect(listProp[1] instanceof B).toBe(true);

                // myUtil is singleton
                expect(listProp[1].util).toBe(listProp[0]);
                expect(listProp[2] instanceof AutoInject1).toBe(true);

                done();
            }
        );
    });

    it('nest list', done => {
        iocInstance.getComponent('nestList').then(
            nestList => {

                expect(nestList instanceof ListA).toBe(true);

                let listArg1 = nestList.listArg1;
                let listArg2 = nestList.listArg2;
                expect(listArg1 instanceof Array).toBe(true);
                expect(listArg1.length).toBe(4);
                expect(listArg1[1] instanceof A).toBe(true);
                expect(listArg1[1].b instanceof B).toBe(true);

                expect(listArg1[2] instanceof B).toBe(true);
                expect(listArg1[3]).toBe('literalValue');

                // nest list
                let list = listArg1[0];
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


                let listProp = nestList.nestProp;
                expect(listProp instanceof Array).toBe(true);
                expect(listProp.length).toBe(3);
                expect(listProp[0] instanceof MyUtil).toBe(true);
                expect(listProp[1] instanceof B).toBe(true);

                list = listProp[2];
                expect(list[0] instanceof AutoInject).toBe(true);
                expect(list[1]).toBe('normalValue');

                done();
            }
        );
    });

    it('nest list with import', done => {
        iocInstance.getComponent('importNestList').then(
            importNestList => {

                expect(importNestList instanceof ListA).toBe(true);

                let listArg1 = importNestList.listArg1;
                expect(listArg1 instanceof Array).toBe(true);
                expect(listArg1.length).toBe(3);
                expect(listArg1[2]).toBe('literalValue');
                expect(listArg1[1] instanceof B).toBe(true);
                expect(listArg1[1].importProp).toBe('importProp');

                let list = listArg1[0];
                expect(list[0]).toBe('literalValue');
                expect(list[1] instanceof A).toBe(true);
                expect(list[1].importProp).toBe('importProp');
                expect(list[2] instanceof B).toBe(true);

                let listProp = importNestList.nestProp;
                expect(listProp instanceof Array).toBe(true);
                expect(listProp.length).toBe(3);
                expect(listProp[0] instanceof MyUtil).toBe(true);
                expect(listProp[1] instanceof B).toBe(true);
                list = listProp[2];
                expect(list[0] instanceof AutoInject).toBe(true);
                expect(list[1]).toBe('normalValue');

                let nestProp = importNestList.importListProp;
                expect(nestProp[0] instanceof MyUtil).toBe(true);
                expect(nestProp[0].prop).toBe('prop');
                expect(nestProp[1] instanceof B).toBe(true);

                list = nestProp[2];
                expect(list[0] instanceof AutoInject).toBe(true);
                expect(list[0].prop).toBe('prop');
                expect(list[1]).toBe('normalValue');

                done();
            }
        );

    });
});

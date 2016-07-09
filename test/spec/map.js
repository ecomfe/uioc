import {IoC} from 'ioc';
import A from 'A';
import B from 'B';
import MyUtil from 'MyUtil';
import MapA from 'map/A';
import AutoInject from 'AutoInject';
import AutoInject1 from 'AutoInject1';
import config from 'config';

describe('map test: ', () => {

    let iocInstance = null;
    beforeEach(() => iocInstance = new IoC(config()));

    it('simple map', done => {
        iocInstance.getComponent('simpleMap').then(
            simpleMap => {
                expect(simpleMap instanceof MapA).toBe(true);

                let arg1 = simpleMap.arg1;
                let arg2 = simpleMap.arg2;

                expect(arg1.literalObject).toEqual({value: 1});
                expect(arg1.a instanceof A).toBe(true);
                expect(arg1.b instanceof B).toBe(true);
                expect(arg1.literalValue).toBe('literalValue');

                expect(arg2.a2 instanceof A).toBe(true);
                expect(arg2.b2 instanceof B).toBe(true);
                expect(arg2.autoInject instanceof AutoInject).toBe(true);

                let mapProp = simpleMap.mapProp;
                expect(mapProp.myUtil instanceof MyUtil).toBe(true);
                expect(mapProp.b3 instanceof B).toBe(true);
                expect(mapProp.autoInject1 instanceof AutoInject1).toBe(true);

                expect(simpleMap.normalProp).toBe('normalProp');

                done();
            }
        );
    });

    it('nest map', done => {
        iocInstance.getComponent('nestMap').then(
            nestMap => {
                expect(nestMap instanceof MapA).toBe(true);

                let arg1 = nestMap.arg1;
                let arg2 = nestMap.arg2;
                expect(arg1.a instanceof A).toBe(true);
                expect(arg1.b instanceof B).toBe(true);
                expect(arg1.literalValue).toBe('literalValue');
                expect(arg1.mapCollection.literalValue).toBe('literalValue');
                expect(arg1.mapCollection.a instanceof A).toBe(true);
                expect(arg1.mapCollection.b instanceof B).toBe(true);

                expect(arg2.a2 instanceof A).toBe(true);
                expect(arg2.b2 instanceof B).toBe(true);
                expect(arg2.list[0] instanceof AutoInject).toBe(true);
                expect(arg2.list[1]).toBe('normalValue');

                let prop = nestMap.nestProp;
                expect(prop.myUtil instanceof MyUtil).toBe(true);
                expect(prop.b3 instanceof B).toBe(true);
                expect(prop.map.list[0] instanceof AutoInject).toBe(true);
                expect(prop.map.list[1]).toBe('normalValue');


                done();
            }
        );
    });

    it('nest map with import and list', done => {
        iocInstance.getComponent('importNestMap').then(
            importNestMap => {

                expect(importNestMap instanceof MapA).toBe(true);

                let arg1 = importNestMap.arg1;
                expect(arg1 instanceof Array).toBe(true);
                expect(arg1.length).toBe(3);
                expect(arg1[2]).toBe('literalValue');
                expect(arg1[1] instanceof B).toBe(true);
                expect(arg1[1].importProp).toBe('importProp');

                let map = arg1[0];
                expect(map.literalValue).toBe('literalValue');
                expect(map.a instanceof A).toBe(true);
                expect(map.a.importProp).toBe('importProp');
                expect(map.b instanceof B).toBe(true);

                let arg2 = importNestMap.arg2;
                expect(arg2[0] instanceof A).toBe(true);
                expect(arg2[1] instanceof B).toBe(true);

                map = arg2[2];
                expect(map.autoInject instanceof AutoInject).toBe(true);
                expect(map.autoInject.importProp).toBe('importProp');
                expect(map.normalValue).toBe('normalValue');

                let listProp = importNestMap.importListProp;
                expect(listProp instanceof Array).toBe(true);
                expect(listProp.length).toBe(3);
                expect(listProp[0] instanceof MyUtil).toBe(true);
                expect(listProp[0].prop).toBe('prop');
                expect(listProp[1] instanceof B).toBe(true);
                expect(importNestMap.isCalled).toBe(true);


                map = listProp[2];
                expect(map.autoInject instanceof AutoInject).toBe(true);
                expect(map.autoInject.importProp).toBe('importProp');
                expect(map.normalValue).toBe('normalValue');

                let nestProp = importNestMap.nestProp;
                expect(nestProp.myUtil instanceof MyUtil).toBe(true);
                expect(nestProp.b3 instanceof B).toBe(true);

                map = nestProp.nestListMap;
                expect(map.list[0] instanceof AutoInject).toBe(true);
                expect(map.importUtil instanceof MyUtil).toBe(true);
                expect(map.normalValue).toBe('normalValue');

                done();
            }
        );

    });
});

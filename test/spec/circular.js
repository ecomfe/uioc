import {IoC} from 'ioc';
import config from 'config';

describe('Ioc Circular Dependency Checking Test: ', () => {

    it('checking circular', async done => {
        let iocInstance = new IoC(config());
        try {
            await iocInstance.getComponent('circular1');
        }
        catch (e) {
            expect(e.message).toBe('circular3 has circular dependencies ');
            done();
        }
    });

    it('skip checking circular', async done => {
        let iocInstance = new IoC(config({skipCheckingCircularDep: true}));
        try {
            await iocInstance.getComponent('circular1');
        }
        catch (e) {
            expect(e.constructor === RangeError).toBe(true);
            done();
        }
    });
});
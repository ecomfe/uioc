import {IoC} from 'ioc';
import FixtureAspect from 'aop/FixtureAspect';

function getIoCWithAopConfig(aopConfig, properties = {}) {
    return new IoC({
        components: {
            fixture: {
                module: 'aop/Fixture',
                properties,
                aopConfig
            }
        },
        loader(ids, cb) {
            require(ids, (...modules) => {
                modules = modules.map(
                    module => module.__esModule ? ('default' in module ? module['default'] : module) : module);
                cb(...modules);
            });
        }
    });
}

function testMethod(proxy, aspect, methodName) {
    let originLog = {
        beforeCount: aspect.beforeLog.count,
        aroundCount: aspect.aroundLog.count,
        afterReturningCount: aspect.afterReturningLog.count,
        afterThrowingCount: aspect.afterThrowingLog.count,
        afterCount: aspect.afterLog.count
    };

    proxy[methodName](1, 2, 3);

    expect(aspect.beforeLog.count).toBe(originLog.beforeCount + 1);
    expect(aspect.beforeLog.args.toString()).toBe('1,2,3');

    expect(aspect.aroundLog.count).toBe(originLog.aroundCount + 1);
    expect(aspect.aroundLog.joinPoint.target).toBe(proxy);
    expect(aspect.aroundLog.joinPoint.args.toString()).toBe('1,2,3');

    expect(aspect.afterReturningLog.count).toBe(originLog.afterReturningCount + 1);
    expect(aspect.afterReturningLog.return).toBe(proxy[methodName + 'Result']);

    expect(aspect.afterThrowingLog.count).toBe(originLog.afterThrowingCount);

    expect(aspect.afterLog.count).toBe(originLog.afterCount + 1);

    // exception
    if (methodName === 'method1') {
        proxy.throwError = new Error('error');
        aspect.afterReturningLog.return = null;
        try {
            expect(() => proxy[methodName]('exception')).toThrowError('error');
        }
        catch (e) {

        }
        expect(aspect.beforeLog.count).toBe(originLog.beforeCount + 2);
        expect(aspect.beforeLog.args.toString()).toBe('exception');

        expect(aspect.aroundLog.count).toBe(originLog.aroundCount + 2);
        expect(aspect.aroundLog.joinPoint.target).toBe(proxy);
        expect(aspect.aroundLog.joinPoint.args.toString()).toBe('exception');
        expect(aspect.aroundLog.joinPoint.method).toBe(methodName);

        expect(aspect.afterReturningLog.count).toBe(originLog.afterReturningCount + 1);
        expect(aspect.afterReturningLog.return).toBe(null);

        expect(aspect.afterThrowingLog.count).toBe(originLog.afterThrowingCount + 1);
        expect(aspect.afterThrowingLog.error).toBe(proxy.throwError);

        expect(aspect.afterLog.count).toBe(originLog.afterCount + 2);
    }
}

describe('AopPlugin literal advices test: object proxy', () => {
    let fixtureAdvices = null;

    beforeEach(() => fixtureAdvices = FixtureAspect.getAdvices());

    it('should intercept the string-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'object',
            advisors: [
                {
                    matcher: 'method1',
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(proxy => {
            testMethod(proxy, fixtureAdvices.aspect, 'method1');
            expect(proxy.count1).toBe(2);
            done();
        });
    });

    it('should intercept the RegExp-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'object',
            advisors: [
                {
                    matcher: /method/,
                    advices: fixtureAdvices
                },
                {
                    matcher: 'propertyValue',
                    advices: fixtureAdvices
                },
                {
                    matcher: 'callMethod3',
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(proxy => {
            testMethod(proxy, fixtureAdvices.aspect, 'method1');
            expect(proxy.count1).toBe(2);
            testMethod(proxy, fixtureAdvices.aspect, 'method2');
            expect(proxy.count2).toBe(1);
            testMethod(proxy, fixtureAdvices.aspect, 'method3');
            expect(proxy.count3).toBe(1);

            // 不影响返回值非函数的 get
            expect(proxy.propertyValue).toBe('propertyValue');

            // 返回值为 function 的 get 会动态创建函数代理
            expect(proxy.callMethod3 !== proxy.callMethod3).toBe(true);
            done();
        });
    });

    it('should intercept the Function-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'object',
            advisors: [
                {
                    matcher: property => ['callMethod3', 'foo'].indexOf(property) !== -1,
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(
            proxy => {
                testMethod(proxy, fixtureAdvices.aspect, 'foo');
                expect(proxy.fooCount).toBe(1);

                let aspect = fixtureAdvices.aspect;
                let originLog = {
                    beforeCount: aspect.beforeLog.count,
                    aroundCount: aspect.aroundLog.count,
                    afterReturningCount: aspect.afterReturningLog.count,
                    afterThrowingCount: aspect.afterThrowingLog.count,
                    afterCount: aspect.afterLog.count
                };

                let result = proxy.callMethod3('callMethod3');
                expect(result).toBe(proxy.method3Result);
                expect(aspect.beforeLog.count).toBe(originLog.beforeCount + 1);
                expect(aspect.beforeLog.args.toString()).toBe('callMethod3');

                expect(aspect.aroundLog.count).toBe(originLog.aroundCount + 1);
                expect(aspect.aroundLog.joinPoint.target).toBe(proxy);
                expect(aspect.aroundLog.joinPoint.args.toString()).toBe('callMethod3');

                expect(aspect.afterReturningLog.count).toBe(originLog.afterReturningCount + 1);
                expect(aspect.afterReturningLog.return).toBe(result);

                expect(aspect.afterThrowingLog.count).toBe(originLog.afterThrowingCount);

                expect(aspect.afterLog.count).toBe(originLog.afterCount + 1);
                done();
            }
        );
    });

    it('should intercept object after create instance', done => {
        let ioc = getIoCWithAopConfig(
            {
                proxyTarget: 'object',
                advisors: [
                    {
                        matcher: 'method1',
                        advices: {
                            around() {}
                        }
                    }
                ]
            },
            {x: 1}
        );

        ioc.getComponent('fixture').then(proxy => {
            expect(proxy.x).toBe(1);
            expect(proxy.print()).toBe(undefined);
            done();
        });
    });
});

describe('AopPlugin literal advices test: class proxy', () => {
    let fixtureAdvices = null;

    beforeEach(() => fixtureAdvices = FixtureAspect.getAdvices());

    it('should intercept the string-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'class',
            advisors: [
                {
                    matcher: 'method1',
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(proxy => {
            testMethod(proxy, fixtureAdvices.aspect, 'method1');
            expect(proxy.count1).toBe(2);
            done();
        });
    });

    it('should intercept the RegExp-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'class',
            advisors: [
                {
                    matcher: /method/,
                    advices: fixtureAdvices
                },
                {
                    matcher: 'propertyValue',
                    advices: fixtureAdvices
                },
                {
                    matcher: 'callMethod3',
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(proxy => {
            testMethod(proxy, fixtureAdvices.aspect, 'method1');
            expect(proxy.count1).toBe(2);
            testMethod(proxy, fixtureAdvices.aspect, 'method2');
            expect(proxy.count2).toBe(1);
            testMethod(proxy, fixtureAdvices.aspect, 'method3');
            expect(proxy.count3).toBe(1);

            // 不影响返回值非函数的 get
            expect(proxy.propertyValue).toBe('propertyValue');

            // 返回值为 function 的 get 会动态创建函数代理
            expect(proxy.callMethod3 !== proxy.callMethod3).toBe(true);

            done();
        });
    });

    it('should intercept the Function-matched method', done => {
        let ioc = getIoCWithAopConfig({
            proxyTarget: 'class',
            advisors: [
                {
                    matcher: property => ['callMethod3', 'foo'].indexOf(property) !== -1,
                    advices: fixtureAdvices
                }
            ]
        });

        ioc.getComponent('fixture').then(proxy => {
            testMethod(proxy, fixtureAdvices.aspect, 'foo');
            expect(proxy.fooCount).toBe(1);

            let aspect = fixtureAdvices.aspect;
            let originLog = {
                beforeCount: aspect.beforeLog.count,
                aroundCount: aspect.aroundLog.count,
                afterReturningCount: aspect.afterReturningLog.count,
                afterThrowingCount: aspect.afterThrowingLog.count,
                afterCount: aspect.afterLog.count
            };

            let result = proxy.callMethod3('callMethod3');
            expect(result).toBe(proxy.method3Result);
            expect(aspect.beforeLog.count).toBe(originLog.beforeCount + 1);
            expect(aspect.beforeLog.args.toString()).toBe('callMethod3');

            expect(aspect.aroundLog.count).toBe(originLog.aroundCount + 1);
            expect(aspect.aroundLog.joinPoint.target).toBe(proxy);
            expect(aspect.aroundLog.joinPoint.args.toString()).toBe('callMethod3');

            expect(aspect.afterReturningLog.count).toBe(originLog.afterReturningCount + 1);
            expect(aspect.afterReturningLog.return).toBe(result);

            expect(aspect.afterThrowingLog.count).toBe(originLog.afterThrowingCount);

            expect(aspect.afterLog.count).toBe(originLog.afterCount + 1);
            done();
        });
    });

    it('should intercept class before create instance', done => {
        let ioc = getIoCWithAopConfig(
            {
                proxyTarget: 'class',
                advisors: [
                    {
                        matcher: 'method1',
                        advices: {
                            around() {}
                        }
                    }
                ]
            },
            {x: 1}
        );

        ioc.getComponent('fixture').then(proxy => {
            expect(proxy.x).toBe(1);
            expect(proxy.print()).toBe(1);
            done();
        });
    });
});

export default class FixtureAspect {
    static getAdvices() {
        let testAspect = new this();
        return {
            aspect: testAspect,
            before: testAspect.before.bind(testAspect),
            around: testAspect.around.bind(testAspect),
            afterReturning: testAspect.afterReturning.bind(testAspect),
            afterThrowing: testAspect.afterThrowing.bind(testAspect),
            after: testAspect.after.bind(testAspect)
        };
    }

    constructor() {
        this.beforeLog = {count: 0};
        this.afterLog = {count: 0};
        this.afterReturningLog = {count: 0};
        this.afterThrowingLog = {count: 0};
        this.aroundLog = {count: 0};
    }

    before(...args) {
        this.log('before');
        this.beforeLog.args = args;
    }

    around(joinPoint) {
        this.log('around');
        this.aroundLog.joinPoint = joinPoint;
        let target = joinPoint.target;
        if (target.applyArgs) {
            return joinPoint.proceedApply(target.applyScope, target.applyArgs);
        }
        else {
            return joinPoint.proceed();
        }
    }

    afterReturning(result) {
        this.log('afterReturning');
        this.afterReturningLog.return = result;
    }

    afterThrowing(e) {
        this.log('afterThrowing');
        this.afterThrowingLog.error = e;
    }

    after() {
        this.log('after');
    }

    log(advice) {
        ++this[`${advice}Log`].count;
        this[`${advice}Log`].time = Date.now();
    }
}

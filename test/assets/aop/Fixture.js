class BaseFixture {
    static applyArgs = null;
    static applyScope = null;

    constructor() {
        Object.assign(this, {
            count1: 0,
            count2: 0,
            method1Result: {},
            method2Result: {},
            throwError: null
        });
    }

    method1() {
        ++this.count1;
        if (this.throwError) {
            throw this.throwError;
        }
        return this.method1Result;
    }

    method2() {
        ++this.count2;
        return this.method2Result;
    }
}

export default class Fixture extends BaseFixture {
    constructor() {
        super();
        Object.assign(this, {
            count3: 0,
            fooCount: 0,
            method3Result: {},
            fooResult: {}
        });
    }

    get propertyValue() {
        return 'propertyValue';
    }

    get callMethod3() {
        return this.method3;
    }

    foo() {
        ++this.fooCount;
        return this.fooResult;
    }

    method3() {
        ++this.count3;
        return this.method3Result;
    }
}

Object.defineProperties(Fixture, {
    foo: {
        writable: false,
        configurable: false,
        enumerable: false
    },
    method3: {
        writable: false,
        configurable: false,
        enumerable: false
    }
});

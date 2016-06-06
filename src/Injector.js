/**
 * @file Injector 依赖注入类
 * @author exodia(d_xinxin@163.com)
 */

import u from './util';

const STORE = Symbol('store');
const GET_INSTANCE = Symbol('getInstance');

/**
 * @private
 */
export default class Injector {

    constructor(context) {
        this.context = context;
        this[STORE] = Object.create(null);
    }

    createInstance(component) {
        if (!component) {
            return Promise.resolve(null);
        }

        switch (component.scope) {
            case 'singleton':
                let id = component.id;
                if (!(id in this[STORE])) {
                    this[STORE][id] = this[GET_INSTANCE](component).then(instance => this[STORE][id] = instance);
                }
                return Promise.resolve(this[STORE][id]);
            case 'transient':
                return this[GET_INSTANCE](component);
            case 'static':
                return Promise.resolve(component.creator);
        }
    }

    injectArgs({args}) {
        return Promise.all(args.map(arg => u.hasRef(arg) ? this.context.getComponent(arg.$ref) : arg));
    }

    dispose() {
        let store = this[STORE];
        for (let k in store) {
            let instance = store[k];
            instance && typeof instance.dispose === 'function' && instance.dispose();
        }

        this[STORE] = null;
    }

    [GET_INSTANCE](component) {
        return this.injectArgs(component).then(args => component.creator(...args));
    }
}


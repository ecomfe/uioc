/**
 * @file Injector.js 依赖注入类
 * @author exodia(d_xinxin@163.com)
 */

import u from './util';

export default class Injector {
    singletons = Object.create(null);

    constructor(context) {
        this.context = context;
    }

    createInstance(component) {
        if (!component) {
            return Promise.resolve(null);
        }

        let id = component.id;
        if (component.scope === 'singleton' && id in this.singletons) {
            return Promise.resolve(this.singletons[id]);
        }

        if (component.scope === 'static') {
            return Promise.resolve(component.creator);
        }

        return this.injectArgs(component).then(
            args => {
                let instance = component.creator(...args);
                if (component.scope === 'singleton') {
                    this.singletons[id] = instance;
                }
                return Promise.resolve(instance);
            }
        );
    }

    injectArgs({args}) {
        return Promise.all(
            args.map(
                arg => new Promise(
                    resolve => u.hasRef(arg) ? this.context.getComponent(arg.$ref).then(resolve) : resolve(arg)
                )
            )
        );
    }

    dispose() {
        let singletons = this.singletons;
        for (let k in singletons) {
            let instance = singletons[k];
            instance && typeof instance.dispose === 'function' && instance.dispose();
        }

        this.singletons = null;
    }
}


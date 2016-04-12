/**
 * @file Injector.js 依赖注入类
 * @author exodia(d_xinxin@163.com)
 */

export default class Injector {
    singletons = Object.create(null);

    constructor(context) {
        this.context = context;
    }

    createInstance(component, cb) {
        if (!component) {
            return cb(null);
        }

        let id = component.id;
        if (component.scope === 'singleton' && id in this.singletons) {
            return cb(this.singletons[id]);
        }

        if (component.scope === 'static') {
            return cb(component.creator);
        }

        this.injectArgs(component, args => {
            let instance = component.creator(...args);
            if (component.scope === 'singleton') {
                this.singletons[id] = instance;
            }
            cb(instance);
        });
    }

    injectArgs(componentConfig, cb) {
        let argConfigs = componentConfig.args;
        let count = argConfigs.length;
        let args = new Array(count);
        let ref = this.context.operators.ref;
        if (!count) {
            return cb(args);
        }

        function done(index, instance) {
            args[index] = instance;
            --count === 0 && cb(args);
        }

        for (let i = argConfigs.length - 1; i > -1; --i) {
            let arg = argConfigs[i];
            ref.has(arg) ? this.context.getComponent(arg.$ref, done.bind(null, i)) : done(i, arg);
        }
    }

    injectProperties(instance, componentConfig, cb) {
        let deps = componentConfig.propDeps;
        let props = componentConfig.properties;
        let ref = this.context.operators.ref;
        let setter = this.context.operators.setter;

        this.context.getComponent(deps, (...args) => {
            for (let k in props) {
                let property = props[k];
                let value = ref.has(property) ? args[deps.indexOf(property.$ref)] : property;
                setter.setProperty(instance, k, value, setter.has(property) && property.$setter);
            }
            cb();
        });
    }

    injectSetters(instance, componentConfig, cb) {
        let deps = componentConfig.setterDeps || [];
        let setter = this.context.operators.setter;

        this.context.getComponent(deps, (...args) => {
            for (let i = deps.length - 1; i > -1; --i) {
                let dep = deps[i];
                setter.setProperty(instance, dep, args[i]);
            }
            cb();
        });
    }

    injectDependencies(instance, componentConfig, cb) {
        let complete = {
            prop: false,
            setter: false
        };

        function done(type) {
            complete[type] = true;
            complete.prop && complete.setter && cb();
        }

        this.injectProperties(instance, componentConfig, done.bind(null, 'prop'));
        this.injectSetters(instance, componentConfig, done.bind(null, 'setter'));
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


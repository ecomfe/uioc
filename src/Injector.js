/**
 * @file Injector.js 依赖注入类
 * @author exodia(d_xinxin@163.com)
 */

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
        let ref = this.context.operators.ref;

        return Promise.all(
            args.map(
                arg => new Promise(
                    resolve => ref.has(arg) ? this.context.getComponent(arg.$ref).then(resolve) : resolve(arg)
                )
            )
        );
    }

    injectProperties(instance, componentConfig) {
        let deps = componentConfig.propDeps;
        let props = componentConfig.properties;
        let ref = this.context.operators.ref;
        let setter = this.context.operators.setter;
        return this.context.getComponent(deps).then(
            args => {
                for (let k in props) {
                    let property = props[k];
                    let value = ref.has(property) ? args[deps.indexOf(property.$ref)] : property;
                    setter.setProperty(instance, k, value, setter.has(property) && property.$setter);
                }
            }
        );
    }

    injectSetters(instance, {setterDeps}) {
        setterDeps = setterDeps || [];
        if (!setterDeps.length) {
            return Promise.resolve();
        }
        let setter = this.context.operators.setter;
        return this.context.getComponent(setterDeps).then(
            components => components.forEach(
                (component, index) => setter.setProperty(instance, setterDeps[index], component)
            )
        );
    }

    injectDependencies(instance, componentConfig) {
        return Promise.all([
            this.injectProperties(instance, componentConfig),
            this.injectSetters(instance, componentConfig)
        ]);
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


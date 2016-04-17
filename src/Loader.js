/**
 * @file Loader.js 组件模块加载类
 * @author exodia(d_xinxin@163.com)
 */

import DependencyTree from './DependencyTree';
import CircularError from './CircularError';

export default class Loader {
    amdLoader = getDefaultLoader();

    constructor(context) {
        this.context = context;
    }

    setLoaderFunction(amdGlobalLoader) {
        this.amdLoader = amdGlobalLoader;
    }

    resolveDependentModules(componentConfig, result = {}, deps) {
        return getDependentModules(componentConfig, this.context, result, new DependencyTree(), deps);
    }

    loadModuleMap(moduleMap) {
        let moduleIds = Object.keys(moduleMap);
        return new Promise(resolve => {
            this.amdLoader(
                moduleIds,
                (...modules) => {
                    modules.forEach(
                        (factory, index) => {
                            let moduleId = moduleIds[index];
                            moduleMap[moduleId].forEach(
                                config => typeof config.creator !== 'function' && this.wrapCreator(config, factory)
                            );
                        }
                    );
                    resolve();
                }
            );
        });
    }

    wrapCreator(config, factory) {
        let creator = config.creator = config.creator || factory;

        if (typeof creator === 'string') {
            let method = factory[creator];
            let moduleFactory = function () {
                return method.apply(factory, arguments);
            };

            creator = (!config.isFactory || config.scope === 'static') ? method : moduleFactory;
            config.creator = creator;
        }

        // 给字面量组件和非工厂组件套一层 creator，后面构造实例就可以无需分支判断，直接调用 component.creator
        if (!config.isFactory && config.scope !== 'static') {
            config.creator = function (...args) {
                return new creator(...args);
            };
        }
    }
}

function getDependentModules(component, context, result, depTree, deps) {
    let module = component.module;
    if (typeof component.creator !== 'function' && module) {
        result[module] = result[module] || [];
        result[module].push(component);
    }
    context.processConfig(component.id);

    let circular = depTree.checkForCircular(component.id);
    if (circular) {
        let msg = `${component.id} has circular dependencies `;
        throw new CircularError(msg, component);
    }

    depTree.addData(component);
    let child = depTree.appendChild(new DependencyTree());

    deps = deps || component.argDeps.concat(component.propDeps).concat(component.setterDeps || []);
    for (let i = deps.length - 1; i > -1; --i) {
        if (context.hasComponent(deps[i])) {
            getDependentModules(context.getComponentConfig(deps[i]), context, result, child);
        }
    }

    return result;
}

function getDefaultLoader() {
    if (typeof define === 'function' && define.amd) {
        return require;
    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        return (ids, cb) => cb(...(ids.map(id => require(id))));
    }
}


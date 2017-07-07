/**
 * @file 组件模块加载类
 * @author exodia(d_xinxin@163.com)
 */

import DependencyTree from './DependencyTree';
import CircularError from './CircularError';

/**
 * @private
 */
export default class Loader {
    amdLoader = getDefaultLoader();

    constructor(context, skipCheckingCircularDep) {
        this.context = context;
        this.skipCheckingCircularDep = skipCheckingCircularDep;
    }

    setLoaderFunction(amdGlobalLoader) {
        this.amdLoader = amdGlobalLoader;
    }

    resolveDependentModules(componentConfig, result = {}, deps) {
        let depTree = this.skipCheckingCircularDep ? null : new DependencyTree();
        return getDependentModules(componentConfig, this.context, result, depTree, deps);
    }

    loadModuleMap(moduleMap) {
        let moduleIds = Object.keys(moduleMap);
        if(!moduleIds.length) {
            return Promise.resolve();
        }

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

    let child = null;
    // depTree 为 null 表示跳过循环检测
    if (depTree) {
        let circular = depTree.checkForCircular(component.id);
        if (circular) {
            let msg = `${component.id} has circular dependencies `;
            throw new CircularError(msg, component);
        }

        depTree.addData(component);
        child = depTree.appendChild(new DependencyTree());
    }


    deps = deps || component.argDeps.concat(component.propDeps).concat(component.setterDeps || []);
    for (let i = deps.length - 1; i > -1; --i) {
        if (context.hasComponent(deps[i])) {
            getDependentModules(context.getComponentConfig(deps[i]), context, result, child);
        }
    }

    return result;
}

const global = Function('return this')();

function getDefaultLoader() {
    if (typeof define === 'function' && define.amd && typeof global.require === 'function') {
        return require;
    }

    if (typeof module !== 'undefined' && module && 'exports' in module) {
        return (ids, cb) => cb(...(ids.map(id => require(id))));
    }

    return (ids, cb) => cb(...(ids.map(id => global[id])));
}

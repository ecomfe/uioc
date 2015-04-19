void function (define) {

    define(
        function (require) {
            var u = require('./util');
            var DependencyTree = require('./DependencyTree');

            function DependencyResolver(context) {
                this.context = context;
            }

            DependencyResolver.prototype.getDependentModules = function (component, result, deps) {
                return getDependentModules(component, this.context, result || {}, new DependencyTree(), deps);
            };

            function getDependentModules(component, context, result, depTree, deps) {
                if (component) {
                    var module = component.module;
                    if (typeof component.creator !== 'function' && module) {
                        result[module] = result[module] || [];
                        result[module].push(component);
                    }

                    var circular = depTree.checkForCircular(component.id);
                    if (circular) {
                        var msg = component.id + ' has circular dependencies ';
                        throw new u.CircularError(msg, component);
                    }

                    depTree.addData(component);
                    var child = depTree.appendChild(new DependencyTree());

                    deps = deps || component.argDeps.concat(component.propDeps).concat(component.setterDeps || []);
                    for (var i = deps.length - 1; i > -1; --i) {
                        getDependentModules(context.getComponentConfig(deps[i]), context, result, child);
                    }
                }

                return result;
            }

            return DependencyResolver;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });
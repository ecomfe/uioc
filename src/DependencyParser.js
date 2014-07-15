void function (define) {

    define(
        function (require) {
            var u = require('./util');
            var DependencyTree = require('./DependencyTree');
            var SETTER_REGEX = /^set([A-Z].*)$/;

            function DependencyParser(context) {
                this.context = context;
            }

            DependencyParser.prototype.setterMatcher = function (name) {
                var methodName = null;
                var matches = name.match(SETTER_REGEX);
                if (matches) {
                    methodName = matches[1];
                    methodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
                }

                return methodName;
            };

            DependencyParser.prototype.getDepsFromArgs = function (args) {
                var deps = [];
                for (var i = args.length - 1; i > -1; --i) {
                    u.hasReference(args[i]) && util.addToSet(deps, args[i].$ref);
                }
                return deps;
            };

            DependencyParser.prototype.getDepsFromProperties = function (properties) {
                var deps = [];
                for (var k in properties) {
                    if (util.hasOwnProperty(properties, k)) {
                        var prop = properties[k];
                        u.hasReference(prop) && util.addToSet(deps, prop.$ref);
                    }
                }
                return deps;
            };

            DependencyParser.prototype.getDepsFromSetters = function (instance) {
                var deps = [];

                return deps;
            };

            DependencyParser.prototype.getDepsFromInterfaces = function () {

            };

            /*DependencyParser.prototype.getArgModules = function (component, context) {
             var result = {};
             if (component) {
             getDependentModules(component, context, result, new DependencyTree());
             }
             return result;
             };*/

            DependencyParser.prototype.getModulesFromComponent = function (component, result) {
                result = result || {};
                if (component) {
                    getDependentModules(component, this.context, result, new DependencyTree());
                }
                return result;
            };

            DependencyParser.prototype.getModulesFromDeps = function (component, deps, result) {
                result = result || {};
                if (component) {
                    getDependentModules(component, this.context, result, new DependencyTree(), deps);
                }
                return result;
            };

            function getDependentModules(component, context, result, depTree, deps) {
                var module = component.module;
                if (typeof component.creator !== 'function' && component.module) {
                    result[module] = result[module] || [];
                    result[module].push(component);
                }

                var circular = depTree.checkForCircular(component.id);
                if (circular) {
                    var msg = component.id + ' has circular dependencies ';
                    throw new util.CircularError(msg, component);
                }

                depTree.addData(component);
                var child = depTree.appendChild(new DependencyTree());

                deps = deps || component.argDeps.concat(component.propDeps).concat(component.setterDeps || []);
                for (var i = deps.length - 1; i > -1; --i) {
                    getDependentModules(context.getComponentConfig(deps[i]), context, result, child);
                }
            }

            return DependencyParser;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
void function (define) {

    define(
        function (require) {
            var u = require('./util');
            var DependencyTree = require('./DependencyTree');
            var SETTER_REGEX = /^set([A-Z].*)$/;

            function DependencyParser(context) {
                this.context = context;
            }

            DependencyParser.prototype.getPropertyFromSetter = function (name) {
                var prop = null;
                var matches = name.match(SETTER_REGEX);
                if (matches) {
                    prop = matches[1];
                    prop = prop.charAt(0).toLowerCase() + prop.slice(1);
                }

                return prop;
            };

            DependencyParser.prototype.getDepsFromArgs = function (args) {
                var deps = [];
                for (var i = args.length - 1; i > -1; --i) {
                    u.hasReference(args[i]) && u.addToSet(deps, args[i].$ref);
                }
                return deps;
            };

            DependencyParser.prototype.getDepsFromProperties = function (properties) {
                var deps = [];
                for (var k in properties) {
                    if (u.hasOwn(properties, k)) {
                        var prop = properties[k];
                        u.hasReference(prop) && u.addToSet(deps, prop.$ref);
                    }
                }
                return deps;
            };

            DependencyParser.prototype.getDepsFromSetters = function (instance, exclude) {
                exclude = exclude || {};
                var deps = [];
                var prop = null;
                for (var k in instance) {
                    if (typeof instance[k] === 'function') {
                        prop = this.getPropertyFromSetter(k);
                        prop && !exclude.hasOwnProperty(prop) && deps.push(prop);
                    }
                }
                return deps;
            };

            DependencyParser.prototype.getDepsFromInterfaces = function () {

            };

            DependencyParser.prototype.getDependentModules = function (component, result, deps) {
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

            return DependencyParser;
        }
    );

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
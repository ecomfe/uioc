/**
 * Created by exodia on 14-5-21.
 */
void function (define) {
    define(
        function () {
            var DependencyNode = function () {
                this.data = [];
                this.children = [];
                this.parent = null;
            };

            DependencyNode.prototype.appendChild = function (node) {
                node.parent = this;
                this.children.push(node);
                return node;
            };

            DependencyNode.prototype.checkForCircular = function (id) {
                var node = this.parent;
                if (node !== null) {
                    var data = node.data;
                    for (var i = data.length - 1; i > -1; --i) {
                        if (node.data[i].id && node.data[i].id === id) {
                            return node.data[i];
                        }

                        return node.checkForCircular(id);
                    }
                }
                return null;
            };

            DependencyNode.prototype.addData = function (data, checkForCircular) {
                checkForCircular = !!checkForCircular;
                if (checkForCircular && this.checkForCircular(data.id)) {
                    return false;
                }

                this.data.push(data);
                return true;
            };

            return DependencyNode;
        });

}(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory; });
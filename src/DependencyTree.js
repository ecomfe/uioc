/**
 * @file DependencyNode 依赖树
 * @author exodia(d_xinxin@163.com)
 */

export default class DependencyNode {
    data = [];
    children = [];
    parent = null;
    
    appendChild(node) {
        node.parent = this;
        this.children.push(node);
        return node;
    }

    checkForCircular(id) {
        let node = this.parent;
        if (node !== null) {
            let data = node.data;
            for (let i = data.length - 1; i > -1; --i) {
                if (node.data[i].id && node.data[i].id === id) {
                    return node.data[i];
                }

                return node.checkForCircular(id);
            }
        }
        
        return null;
    }

    addData(data, checkForCircular) {
        if (checkForCircular && this.checkForCircular(data.id)) {
            return false;
        }

        this.data.push(data);
        return true;
    }
}

    

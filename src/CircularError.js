/**
 * @file 循环依赖错误
 * @author exodia(d_xinxin@163.com)
 * @private
 */

export default class CircularError extends Error {
    constructor(message, component) {
        super(message);
        this.component = component;
    }

    print(...args) {
        if (typeof console !== 'undefined') {
            console.warn(...args);
        }
    }
}

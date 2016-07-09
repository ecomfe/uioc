define(function (require) {
    return {
        init: function () {
            // 配置化
            var config = require('./config');
            var IoC = require('ioc').IoC;
            ioc = new IoC(config);
            ioc.getComponent('List', function (list) {
                list.enter();
            });
        }
    };
});
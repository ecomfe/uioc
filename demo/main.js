define(function (require) {
    return {
        init: function () {
            // 配置化
            var config = require('./config');
            var ioc = require('ioc')(config);
            ioc.getComponent('List', function (list) {
                list.enter();
            });
        }
    };
});
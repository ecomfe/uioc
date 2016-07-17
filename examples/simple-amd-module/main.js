define(function (require) {
    return {
        init: function () {
            var config = require('./config');
            var IoC = require('ioc').IoC;
            var ioc = new IoC(config);
            ioc.getComponent('list').then(function (list) {
                list.enter();
            });
        }
    };
});
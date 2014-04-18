define(function () {
    // 程序式的注册获取容器
    var ioc = require('./programmatic');
    // 配置化
    /* var config = require('./config');
     var ioc = require('../../../ioc').create(config);
     */
    ioc.getComponent('List', function (list) {
        list.enter()
    });
});
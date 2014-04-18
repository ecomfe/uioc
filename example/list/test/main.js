/**
 * Created by exodia on 14-4-18.
 */
define(function () {
    var config = require('./config');
    var ioc = require('../../../ioc').create(config);
    ioc.getComponent('List', function (list) {
        list.enter();
    })
});
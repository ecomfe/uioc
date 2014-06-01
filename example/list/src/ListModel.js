define(function () {
    var permission = null;
    var permissionConfig = null;

    function ListModel() {
        this.dataPool = {};
    }


    ListModel.prototype.addData = function (name, data) {
        console.log('[ListModel addData]', name)
        if (typeof name !== 'string') {
            name = 'default';
        }

        this.dataPool[name] = data;
    };

    ListModel.prototype.data = function (name) {
        console.log('[ListModel data]')
        name = name || 'default';
        return this.dataPool[name];
    };

    ListModel.prototype.load = function () {
        console.log('[ListModel load]');
        this.results = this.data().list();
    };

    ListModel.prototype.getAllItems = function () {
        console.log('[ListModel getAllItems]');
        return this.results;
    };

    ListModel.prototype.datasource = {
        canModify: permission(permissionConfig.canModify),
        canView: permission(permissionConfig.canView)
    }

    ListModel.prototype.setPermission = function (v) {
        permission = v;
    };

    ListModel.prototype.setPermissionConfig = function (v) {
        permissionConfig = v;
    };


    return ListModel;
});
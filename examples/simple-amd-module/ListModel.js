define(function () {
    function ListModel() {
        console.log('ListModel init!');
        this.stores = {};
    }

    ListModel.prototype.load = function () {
        this.set('results', [
            {
                name: 'creative1'
            } ,
            {
                name: 'creative2'
            },
            {
                name: 'creative3'
            },
            {
                name: 'creative4'
            }
        ]);
        console.log('[ListModel load]');

    };

    ListModel.prototype.get = function (name) {
        var value = this.stores[name];
        return typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
    };

    ListModel.prototype.set = function (name, value) {
        this.stores[name] = typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
    };

    return ListModel;
});
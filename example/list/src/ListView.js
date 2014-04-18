define(function () {
    function ListView() {

    }

    ListView.prototype.render = function () {
        console.log('[ListView render]');
        var items = this.model.getAllItems();
        items.forEach(function (item) {
            console.log(this.template + item.id + ':' + item.name);
        })
    };

    return ListView;
});
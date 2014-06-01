define(function () {
    function List(entityName) {
        console.log('List init!');
        this.entityName = entityName
    }

    List.prototype.enter = function () {
        console.log('[List enter]: entityName is ' + this.entityName);
        this.view.model = this.model;
        this.model.load();
        this.view.render();
    };

    return List;
});


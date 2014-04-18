function List(entityName) {
    this.entityName = entityName
}

List.prototype.enter = function () {
    console.log('[List enter]: entityName is ' + this.entityName);
    this.model.load();
    this.view.render();
};


module.exports = List;
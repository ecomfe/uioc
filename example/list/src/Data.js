define(function () {
    function Data(entityName, backendEntityName) {
        this.entityName = entityName;
        this.backendEntityName = backendEntityName;
        console.log('[Data init]')
    }

    Data.prototype.list = function () {
        console.log('[Data list]:' + this.entityName + ' ' + this.backendEntityName);
        return {
            total: 1,
            data: [
                { id: 1, name: 'creative1' },
                { id: 2, name: 'creative2' }
            ]
        };
    };

    return Data;
});
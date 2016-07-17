define(function () {
    function ListView() {
        console.log('ListView init!');
    }

    ListView.prototype.render = function () {
        console.log('[ListView render]');
        var results = this.model.get('results');
        var html = '<ul>';
        results.forEach(function (item) {
            html += this.template.replace(/\${(.*)}/, function (match, $1) {
                return item[$1];
            });
        }, this);

        html += '</ul>';

        document.body.innerHTML = html;
    };

    return ListView;
});
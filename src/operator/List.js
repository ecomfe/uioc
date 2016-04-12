import u from '../util';

export default class List {
    static LIST_COMPONENT_CONFIG = {
        creator(...args) {
            return args;
        },
        isFactory: true
    };

    static LIST_COMPONENT_ID = `${Date.now()}_list`;

    constructor(context) {
        this.context = context;
    }

    process(config) {
        let args = config.args;
        for (let i = 0, len = args.length; i < len; ++i) {
            let arg = args[i];
            // {$list: [{}, {}]} => {$import: List.LIST_COMPONENT_ID, args: []}
            if (this.has(arg)) {
                args[i] = {
                    $import: List.LIST_COMPONENT_ID,
                    args: arg.$list
                };
            }
        }

        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            if (this.has(property)) {
                properties[k] = {
                    $import: List.LIST_COMPONENT_ID,
                    args: property.$list
                };
            }
        }

        return config;
    }

    has(obj) {
        return u.isObject(obj) && obj.$list instanceof Array;
    }
}

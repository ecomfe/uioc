import u from '../util';

export default class Map {

    static MAP_COMPONENT_CONFIG = {
        creator: Object,
        isFactory: true
    };

    static MAP_COMPONENT_ID = `${(new Date()).getTime()}_map`;

    constructor(context) {
        this.context = context;
    }

    process(config) {
        let args = config.args;
        for (let i = 0, len = args.length; i < len; ++i) {
            let arg = args[i];
            // {$map: {}} => {$import: Map.MAP_COMPONENT_ID, properties: {}}
            if (this.has(arg)) {
                args[i] = {
                    $import: Map.MAP_COMPONENT_ID,
                    properties: arg.$map
                };
            }
        }

        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            if (this.has(property)) {
                properties[k] = {
                    $import: Map.MAP_COMPONENT_ID,
                    properties: property.$map
                };
            }
        }

        return config;
    }

    has(obj) {
        return u.isObject(obj) && u.isObject(obj.$map);
    }
}

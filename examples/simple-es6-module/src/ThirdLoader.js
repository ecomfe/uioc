import {request} from './third/sdk';
export default class ThirdServiceLoader {
    async load() {
        return request();
    }
}
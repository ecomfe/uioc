export default class Loader {
    constructor(url) {
        this.url = url;
    }

    async load() {
        let result = await fetch(this.url);
        return result.json();
    }
}
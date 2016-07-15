// List.js
export default class List {
    constructor(container, loader) {
        this.container = container;
        this.loader = loader;
    }

    async render() {
        this.container.textContent = await this.loader.load();
    }
}
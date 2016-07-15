import {IoC} from 'uioc';
import config from './config';

let ioc = new IoC(config);
ioc.getComponent(['listA', 'listB']).then(([listA, listB]) => {
    listA.render();
    listB.render();
}).catch(function (e) {
    console.log(e);
});
import List from './List';
import Loader from './Loader';
import ThirdLoader from './ThirdLoader'

export default {
    components: {
        listA: {
            creator: List,
            args: [document.getElementById('a'), {$ref: 'loader'}]
        },
        listB: {
            creator: List,
            args: [document.getElementById('b'), {$ref: 'thirdLoader'}]
        },
        loader: {
            creator: Loader,
            args: ['list.json']
        },
        thirdLoader: {
            creator: ThirdLoader
        }
    }
};
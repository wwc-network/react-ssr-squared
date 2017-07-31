import { syncRoute} from '../shared/utils/routes.js';

// TODO: If all routes in end up having a async counterpart, we can use normalmodulereplacement on this and possibly consolidate
import { Home,  About } from './route-components.js';

export default {
    routes: [
        {
            path: '/',
            component: Home,
            exact: true
        },
        {
            path: '/about',
            component: About,
            exact: true
        }   
    ]
};
import { syncRoute} from '../shared/utils/routes.js';

// TODO: If all routes in end up having a async counterpart, we can use normalmodulereplacement on this and possibly consolidate
const Home = syncRoute(require('../shared/pages/home/index.jsx'), 'Home');

const About = syncRoute(require('../client/pages/about/index.jsx'), 'About');

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
import { asyncRoute, syncRoute} from '../shared/utils/routes.js';

export const Home = syncRoute(require('../shared/pages/home/index.jsx'), 'Home');

export const About = asyncRoute(() => System.import('./pages/about/index.jsx'), 'About');

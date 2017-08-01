import { syncRoute } from '../shared/utils/routes.js';

export const Home = syncRoute(require('../shared/pages/home/index.jsx'), 'Home');

export const About = syncRoute(require('../client/pages/about/index.jsx'), 'About');

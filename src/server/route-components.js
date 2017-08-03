import { syncComponent } from '../shared/modules/sync-component/index.js';

export const Home = syncComponent(require('../shared/pages/home/index.jsx'), 'Home');

export const About = syncComponent(require('../shared/pages/about/index.jsx'), 'About');

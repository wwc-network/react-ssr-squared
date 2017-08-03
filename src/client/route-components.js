import { asyncComponent } from '../shared/modules/async-component/index.js';

export const Home = asyncComponent(() => System.import('../shared/pages/home/index.jsx'), 'Home');

export const About = asyncComponent(() => System.import('../shared/pages/about/index.jsx'), 'About');

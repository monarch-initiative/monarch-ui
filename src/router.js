import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
// import Analytics from './views/Analytics.vue';
import Node from './views/Node.vue';

Vue.use(Router);

const availableCardTypes = [
  'anatomy',
  'cellline',
  'disease',
  'function',
  'gene',
  'genotype',
  'homolog',
  'interaction',
  'literature',
  'model',
  'ortholog-phenotype',
  'ortholog-disease',
  'pathway',
  'phenotype',
  'variant',
];

const nodeRoutes = availableCardTypes.map(nodeType => (
  {
    path: `/${nodeType}/:id`,
    name: `/Node${nodeType}`,
    component: Node,
  }));

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...nodeRoutes,
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search/:query',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "analytics" */ './views/Search.vue'),
    },
    {
      path: '/analyze/phenotypes',
      name: 'analyzephenotypes',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "analyzephenotypes" */ './views/AnalyzePhenotypes.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "analytics" */ './views/Analytics.vue'),
    },
    {
      path: '/*',
      name: 'MonarchLegacy',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "MonarchLegacy" */ './views/MonarchLegacy.vue'),
    },
  ],
});

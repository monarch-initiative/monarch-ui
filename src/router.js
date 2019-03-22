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
  'publication',
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

const router = new Router({
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
      path: '/about/readme',
      name: 'about-readme',
      component: require('../README.md').default,
    },
    {
      path: '/about/monarch',
      name: 'about-monarch',
      component: require('@/views/AboutMonarch.md').default,
    },
    {
      path: '/about/team',
      name: 'about-team',
      component: require('@/views/AboutTeam.md').default,
    },
    {
      path: '/search/:query?',
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

// https://stackoverflow.com/a/47195471/5667222
function hasQueryParams(route) {
  return Object.keys(route.query).length > 0;
}


router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    const toWithQuery = Object.assign({}, to,
      {
        query: from.query
      });
    next(toWithQuery);
  }
  else {
    next();
  }
});

export default router;

import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
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
      path: '/about/citing',
      name: 'about-citing',
      component: require('@/views/Citing.md').default,
    },
    {
      path: '/search/:query?',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue'),
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
      path: '/sources',
      name: 'sources',
      // Work done at Hackathon Seth Dan Nathan Chris
      component: () => import(/* webpackChunkName: "analytics" */ './views/Sources.vue'),
    },
    {
      path: '/*',
      name: 'RouteError',
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "routeerror" */ './views/RouteError.vue'),
    },
  ],

  // https://router.vuejs.org/guide/advanced/scroll-behavior.html
  scrollBehavior(to, from, savedPosition) {
    let result = { x: 0, y: 0 };

    if (savedPosition) {
      result = savedPosition;
    }
    else if (to.hash) {
      result = {
        selector: to.hash
        // , offset: { x: 0, y: 10 }
      };
    }

    return result;
  }
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

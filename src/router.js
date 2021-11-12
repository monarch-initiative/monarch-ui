import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Node from "./views/Node.vue";
import { getBasicNode } from "./api/bio-link";
import { reduceCategoryList } from "./lib/category-map";

Vue.use(Router);

const availableCardTypes = [
  "anatomy",
  "cellline",
  "case",
  "disease",
  "function",
  "gene",
  "genotype",
  "homolog",
  "interaction",
  "publication",
  "model",
  "ortholog-phenotype",
  "ortholog-disease",
  "pathway",
  "phenotype",
  "variant",
];

// handle redirect from 404
const handle404 = (to, from, next) => {
  const redirect = sessionStorage.redirect;
  if (redirect) {
    console.info({ redirect });
    delete sessionStorage.redirect;
    next(redirect);
  } else {
    next();
  }
};

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    ...availableCardTypes.map((nodeType) => ({
      path: `/${nodeType}/:id`,
      name: `/Node${nodeType}`,
      component: Node,
      beforeEnter: (to, from, next) => {
        // We generally want to avoid routing hacks but are
        // making an exception since a lot of our referral
        // traffic comes from GARD, see
        // https://github.com/monarch-initiative/monarch-ui/issues/325
        if (to.fullPath.startsWith("/disease/Orphanet:")) {
          const nodeId = to.params.id.replace("Orphanet", "ORPHA");
          router.push(`/disease/${nodeId}`);
        } else {
          next();
        }
      },
    })),
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: handle404,
    },
    {
      path: "/about/monarch",
      name: "about-monarch",
      component: require("@/views/AboutMonarch.md").default,
    },
    {
      path: "/about/monarch-web-services",
      name: "monarch-web-services",
      component: require("@/views/Services.md").default,
    },
    {
      path: "/about/team",
      name: "about-team",
      component: require("@/views/AboutTeam.md").default,
    },
    {
      path: "/about/disclaimer",
      name: "about-disclaimer",
      component: require("@/views/Disclaimer.md").default,
    },
    {
      path: "/documentation/publications",
      name: "about-publications",
      component: require("@/views/Publications.md").default,
    },
    {
      path: "/help/cite",
      name: "about-citing",
      component: require("@/views/Citing.md").default,
    },
    {
      path: "/help/linkout",
      name: "link-to-us",
      component: require("@/views/LinkToUs.vue").default,
    },
    {
      path: "/help/contact",
      name: "contact-us",
      component: require("@/views/Contact.md").default,
    },
    {
      path: "/tools/other-tools",
      name: "other-tools",
      component: require("@/views/OtherTools.md").default,
    },
    {
      path: "/tools/text-annotate",
      name: "text-annotate",
      component: () =>
        import(
          /* webpackChunkName: "text-annotate" */ "./views/TextAnnotator.vue"
        ),
    },
    {
      path: "/search/:query?",
      name: "search",
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "search" */ "./views/Search.vue"),
    },
    {
      path: "/analyze/phenotypes",
      name: "analyze-phenotypes",
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "analyze-phenotypes" */ "./views/AnalyzePhenotypes.vue"
        ),
    },
    {
      path: "/analytics",
      name: "analytics",
      // route level code-splitting
      // this generates a separate chunk (analytics.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "mon-analytics" */ "./views/Analytics.vue"),
    },
    {
      path: "/about/data-sources",
      name: "sources",
      // Work done at Hackathon Seth Dan Nathan Chris
      component: () =>
        import(/* webpackChunkName: "data-sources" */ "./views/Sources.vue"),
    },
    {
      path: "/about/licensing",
      name: "licensing",
      component: () =>
        import(/* webpackChunkName: "licensing" */ "./views/Licensing.vue"),
    },
    {
      path: "/about/phenotypes",
      name: "about-phenotypes",
      component: require("@/views/AboutPhenotypes.md").default,
    },
    {
      path: "/glossary",
      name: "glossary",
      component: require("@/views/glossary.md").default,
    },
    {
      path: "/*",
      name: "RouteError",
      component: () =>
        import(/* webpackChunkName: "routeerror" */ "./views/RouteError.vue"),

      // Attempt to resolve identifiers to the correct route
      // eg /MONDO:0007947 -> /disease/MONDO:0007947
      beforeEnter: (to, from, next) => {
        let nodeId = to.params.pathMatch;
        if (nodeId.startsWith("MONARCH")) {
          // Curie map converts
          // https://monarchinitiative.org/MONARCH:1234
          // to :MONARCH:1234, we use these IRIs for case pages
          // TODO fix this in the UDP ingest
          nodeId = ":" + nodeId;
        }
        getBasicNode(nodeId)
          .then((node) => {
            const reducedType = reduceCategoryList(node.category);
            if (!reducedType) {
              next();
            } else if (!availableCardTypes.includes(reducedType)) {
              // Should these go to some generic page?
              next();
            } else {
              router.push(`/${reducedType}/${nodeId}`);
            }
          })
          .catch(() => next());
      },
    },
  ],

  // https://router.vuejs.org/guide/advanced/scroll-behavior.html
  scrollBehavior(to, from, savedPosition) {
    let result = { x: 0, y: 0 };

    if (savedPosition) {
      result = savedPosition;
    } else if (to.hash) {
      result = {
        selector: to.hash,
        // , offset: { x: 0, y: 10 }
      };
    }

    return result;
  },
});

// https://stackoverflow.com/a/47195471/5667222
function hasQueryParams(route) {
  return Object.keys(route.query).length > 0;
}

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    const toWithQuery = Object.assign({}, to, {
      query: from.query,
    });
    next(toWithQuery);
  } else {
    next();
  }
});

export default router;

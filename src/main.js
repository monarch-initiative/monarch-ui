import Vue from "vue";
import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "phenogrid/dist/phenogrid-bundle.css";
import VueGtag from "vue-gtag";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

if (window.location.hostname === "monarchinitiative.org") {
  Vue.use(
    VueGtag,
    {
      config: {
        id: "G-D165H4CWLP",
        params: {
          anonymize_ip: true,
          cookie_flags: "SameSite=None;Secure",
        },
      },
    },
    router
  );
}

new Vue({
  router,
  mounted() {},
  render: (h) => h(App),
}).$mount("#app");

window.MonarchUIVersion = "1.0.2";

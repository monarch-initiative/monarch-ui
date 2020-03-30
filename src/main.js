import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueGtag from 'vue-gtag';
import router from './router';
import { productionServers } from './api/BioLink';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

if (productionServers.includes(window.location.hostname)) {
  Vue.use(VueGtag, {
    config: {
      id: 'UA-41803362-1',
      params: {
        anonymize_ip: true
      }
    }
  }, router);
}

new Vue({
  router,
  mounted() {
  },
  render: h => h(App)
}).$mount('#app');

window.MonarchUIVersion = '1.0.0';

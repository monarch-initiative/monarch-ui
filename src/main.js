import '@babel/polyfill';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import axios from 'axios';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import Phenogrid from 'phenogrid/dist/phenogrid-bundle';
import 'phenogrid/dist/phenogrid-bundle.css';

import router from './router';
// import './registerServiceWorker';

import App from './App.vue';
import '@/style/debug-logo-animation.scss';

const Phenogrid = require('phenogrid');

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
// Vue.use(Phenogrid);

new Vue({
  router,
  mounted() {
    document.querySelector('.debug-area').style.display = 'block';
    // debugLogos[0].style.display = 'block';
    // debugLogos[1].style.display = 'block';
  },
  render: h => h(App)
}).$mount('#app');


// Code for the SPA spinner

const debugSpinnerLink = document.querySelector('.debug-spinner');
const debugLogos = global.document.querySelectorAll('.debug-spinner-logo');
debugSpinnerLink.addEventListener('click', () => {
  debugLogos[0].classList.toggle('rotate');
  debugLogos[1].classList.toggle('rotate');
});

window.MonarchUIVersion = '0.0.9';

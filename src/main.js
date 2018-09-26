import '@babel/polyfill';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import router from './router';
// import './registerServiceWorker';

import App from './App.vue';


// Code for the SPA spinner, wh

import '@/style/debug-logo-animation.scss';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

const debugArea = document.querySelector('.debug-area');
const debugSpinnerLink = document.querySelector('.debug-spinner');
const debugLogos = global.document.querySelectorAll('.debug-spinner-logo');
debugSpinnerLink.addEventListener('click', () => {
  debugLogos[0].classList.toggle('rotate');
  debugLogos[1].classList.toggle('rotate');
});

new Vue({
  router,
  mounted() {
    debugArea.style.display = 'block';
    // debugLogos[0].style.display = 'block';
    // debugLogos[1].style.display = 'block';
  },
  render: h => h(App)
}).$mount('#app');

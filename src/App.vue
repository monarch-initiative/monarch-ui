<template>
  <div id="app">
    <monarch-navbar/>

    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    'monarch-navbar': Navbar
  }
};

</script>

<style lang="scss">
@import "~@/style/variables.scss";

$fa-font-path: "~font-awesome/fonts" !default;
@import '~font-awesome/scss/font-awesome';
@import "~bootstrap/scss/bootstrap";
@import '~bootstrap-vue/dist/bootstrap-vue.css';

.container-fluid.monarch-view {
  margin-top: $navbar-height;
  xheight: 100%;
  xwidth: 100%;
  xmargin: 0;
  xpadding: 0;
}

[v-cloak] {
  display: none;
}
</style>

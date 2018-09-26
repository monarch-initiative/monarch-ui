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

#monarch-content-fragment {
  margin: 0;
  padding: 0;
}

$fa-font-path: "~font-awesome/fonts" !default;
@import '~font-awesome/scss/font-awesome';
@import "~bootstrap/scss/bootstrap";
@import '~bootstrap-vue/dist/bootstrap-vue.css';

.wrapperforfooter {
  min-height: 100%;
  width: 100%;
  margin: ($navbar-height + 3) 0 2px 0;
  padding: 0;
}

.wrapperforfooter .container-fluid.monarch-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

[v-cloak] {
  display: none;
}
</style>

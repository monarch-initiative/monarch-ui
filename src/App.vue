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
  xborder:5px solid orange;
}

[v-cloak] {
  display: none;
}

div.vue-markdown {
  margin-top: $navbar-height;
  xborder: 5px solid cyan;
}

div.container-fluid.monarch-home-view div.vue-markdown,
div.container-fluid.monarch-view div.vue-markdown {
  margin-top: 0;
  xborder: 5px solid magenta;
}

div.vue-markdown-plain {
  margin-top: $navbar-height;
  padding: 20px;
  xborder: 5px solid lightgreen;
}
</style>

<template>
  <div
    id="app"
    class="page-wrapper">

    <div
      class="content-wrapper">
      <monarch-navbar/>
      <router-view/>
    </div>

    <div
      class="footer-wrapper">
      <monarch-footer
        :compact="useCompactFooter"/>
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

Vue.component('monarch-footer', Footer);
export default {
  name: 'App',
  components: {
    'monarch-navbar': Navbar
  },
  data() {
    return {
      useCompactFooter: false,
    };
  },
  watch: {
    '$route': function $route(to, from) {
      this.useCompactFooter = (to.path !== '/');
    }
  },
  mounted() {
    this.useCompactFooter = (this.$route.path !== '/');
  },
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
}

[v-cloak] {
  display: none;
}

// https://medium.freecodecamp.org/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c

#app.page-wrapper {
  position: absolute;
  min-height: 100vh;
  width: 100%;
}

#app.page-wrapper .content-wrapper {
  padding-bottom: $footer-height;
  margin: 0;
}

#app.page-wrapper .footer-wrapper {
  position: absolute;
  z-index: $monarch-footer-z;
  bottom: 0;
  width: 100%;
  height: $footer-height;
  padding: 0;
  margin: 0;
}


div.vue-markdown {
  xmargin-top: $navbar-height;
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

:target::before {
  content: "";
  display: block;
  height: $navbar-height; /* fixed header height*/
  margin: -$navbar-height 0 0; /* negative fixed header height */
}

a.header-anchor {
  vertical-align: middle;
  font-size: 0.6em;
  opacity: 0;
  padding-top: 90px;
}

a.header-anchor, a.header-anchor:hover, .title a {
  text-decoration: none;
}

h1:hover a.header-anchor, h2:hover a.header-anchor, h3:hover a.header-anchor,
h4:hover a.header-anchor, h5:hover a.header-anchor, h6:hover a.header-anchor {
  opacity: 1;
}

blockquote.blockquote {
  padding: 4px 4px 0 8px;
  font-size: ($font-size-base * 1.1);
  border-radius: 5px;
  border-left: 2px solid lightgray;
}

</style>

<template>
  <div id="app" class="page-wrapper">
    <monarch-navbar />
    <div class="content-wrapper">
      <router-view />
    </div>
    <div class="footer-wrapper">
      <monarch-footer
        :compact="useCompactFooter"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { sanitizeText } from '@/lib/Utils';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

Vue.prototype.$sanitizeText = sanitizeText;

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

[v-cloak] {
  display: none;
}

.row {
  padding-right: 15px;
  padding-left: 15px;
}
#app.page-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app.page-wrapper .content-wrapper {
  flex: 1;
  margin: 0;
  background-color: #efefef;
}

#app.page-wrapper .footer-wrapper {
  z-index: $monarch-footer-z;
  bottom: 0;
  width: 100%;
  height: $footer-height;
  padding: 0;
  margin: 0;
}

.monarch-view {
  padding-top: 15px;
  padding-bottom: 15px;
}


div.container-fluid.monarch-home-view div.vue-markdown,
div.container-fluid.monarch-view div.vue-markdown {
  margin-top: 0;
}

div.vue-markdown-plain {
  margin-top: $navbar-height;
  padding: 20px;

  pre {
    background-color: #f6f8fa;
    border-radius: 3px;
    font-size: 85%;
    line-height: 1.45;
    overflow: auto;
    padding: 16px;

    code {
      background-color: unset;
      border-radius: unset;
      color: unset;
      font-size: unset;
      margin: unset;
      padding: unset;
    }
  }

  code {
    background-color: #f6f8fa;
    border-radius: 3px;
    color: #24292e;
    background-color: rgba(27,31,35,.05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: .2em .4em;
  }
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

html, body {
  font-family: 'Poppins', sans-serif;
}

.gfc-tooltip {
  position: fixed !important;
}

@media (min-width: 2400px) {

  .col-desktop-1, .col-desktop-2, .col-desktop-3, .col-desktop-4, .col-desktop-5, .col-desktop-6, .col-desktop-7, .col-desktop-8, .col-desktop-9, .col-desktop-10, .col-desktop-11, .col-desktop-12 {
    float: left;
  }

  .col-desktop-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-desktop-11 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 91.66666667%;
    flex: 0 0 91.66666667%;
    max-width: 91.66666667%;
  }

  .col-desktop-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 83.33333333%;
    flex: 0 0 83.33333333%;
    max-width: 83.33333333%;
  }

  .col-desktop-9 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 75%;
    flex: 0 0 75%;
    max-width: 75%;
  }

  .col-desktop-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 66.66666667%;
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
  }

  .col-desktop-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 58.33333333%;
    flex: 0 0 58.33333333%;
    max-width: 58.33333333%;
  }

  .col-desktop-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }

  .col-desktop-5 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 41.66666667%;
    flex: 0 0 41.66666667%;
    max-width: 41.66666667%;
  }

  .col-desktop-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.33333333%;
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
  }

  .col-desktop-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }

  .col-desktop-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 16.66666667%;
    flex: 0 0 16.66666667%;
    max-width: 16.66666667%;
  }

  .col-desktop-1 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 8.33333333%;
    flex: 0 0 8.33333333%;
    max-width: 8.33333333%;
  }

  .offset-desktop-12 {
    margin-left: 100%;
  }

  .offset-desktop-11 {
    margin-left: 91.66666667%;
  }

  .offset-desktop-10 {
    margin-left: 83.33333333%;
  }

  .offset-desktop-9 {
    margin-left: 75%;
  }

  .offset-desktop-8 {
    margin-left: 66.66666667%;
  }

  .offset-desktop-7 {
    margin-left: 58.33333333%;
  }

  .offset-desktop-6 {
    margin-left: 50%;
  }

  .offset-desktop-5 {
    margin-left: 41.66666667%;
  }

  .offset-desktop-4 {
    margin-left: 33.33333333%;
  }

  .offset-desktop-3 {
    margin-left: 25%;
  }

  .offset-desktop-2 {
    margin-left: 16.66666667%;
  }

  .offset-desktop-1 {
    margin-left: 8.33333333%;
  }

  .col-desktop-offset-0 {
    margin-left: 0;
  }

  .visible-desktop {
    display: block !important;
  }

  table.visible-desktop {
    display: table;
  }

  tr.visible-desktop {
    display: table-row !important;
  }

  th.visible-desktop, td.visible-desktop {
    display: table-cell !important;
  }

  .visible-desktop-block {
    display: block !important;
  }

  .visible-desktop-inline {
    display: inline !important;
  }

  .visible-desktop-inline-block {
    display: inline-block !important;
  }

  .hidden-desktop {
    display: none !important;
  }
}

</style>

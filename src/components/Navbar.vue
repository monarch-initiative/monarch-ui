<template>

  <b-navbar
    id="monarchng-navbar"
    class="xnavbar fixed-top navbar-expand-monarch xnavbar-dark xbg-dark"
    fixed="true"
    toggleable="md"
    type="dark"
    variant="info"
  >
    <b-navbar-brand
      to="/">
      <img
        class="branding-logo"
        src="../assets/img/monarch-logo-white.png"
        alt="Monarch Initiative logo"
        title="Monarch Initiative front page">
    </b-navbar-brand>
    <b-collapse
      id="nav_collapse"
      is-nav=""
    >
      <b-navbar-nav>
        <!--
        <b-nav-item-dropdown
          text="Browse"
        >
          <b-dropdown-item
            to="/disease">
            Diseases
          </b-dropdown-item>
          <b-dropdown-item
            to="/phenotype">
            Phenotypes
          </b-dropdown-item>
          <b-dropdown-item
            to="/gene">
            Genes
          </b-dropdown-item>
          <b-dropdown-item
            to="/model">
            Models
          </b-dropdown-item>
        </b-nav-item-dropdown>
        -->
        <b-nav-item-dropdown
          text="Tools"
        >
          <b-dropdown-item
            to="/analyze/phenotypes">
            Analyze Phenotypes
          </b-dropdown-item>
          <b-dropdown-item
            to="/annotate/text">
            Annotate Text
          </b-dropdown-item>
          <b-dropdown-item
            to="/page/exomes">
            Exomes
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown
          text="About"
        >
          <b-dropdown-item
            to="/about/monarch">
            About Monarch
          </b-dropdown-item>

          <b-dropdown-item
            to="/about/team">
            About Us
          </b-dropdown-item>

          <!--
          <b-dropdown-item
            to="/page/disclaimer">
            Disclaimer
          </b-dropdown-item>

          <b-dropdown-item
            to="/page/pubs">
            Publications
          </b-dropdown-item>

          <b-dropdown-item
            to="/page/links">
            Link To Us
          </b-dropdown-item>
          -->

          <b-dropdown-item
            to="/about/README">
            README
          </b-dropdown-item>

          <b-dropdown-item
            href="https://github.com/monarch-initiative"
            target="_blank">
            GitHub Organization
          </b-dropdown-item>

          <b-dropdown-divider/>

          <b-dropdown-item
            to="/disease/MONDO:0007947">
            Marfan syndrome MONDO:0007947
          </b-dropdown-item>

          <b-dropdown-item
            to="/gene/HGNC:17397">
            BANF1 HGNC:17397
          </b-dropdown-item>

          <b-dropdown-item
            to="/gene/MGI:3A98365">
            Sox3 (Mus musculus) MGI:3A98365
          </b-dropdown-item>

          <b-dropdown-item
            to="/gene/ZFIN:ZDB-GENE-980526-333">
            sox3 (Danio rerio) ZFIN:ZDB-GENE-980526-333
          </b-dropdown-item>

        </b-nav-item-dropdown>

        <b-nav-item-dropdown
          text="Data"
        >
          <b-dropdown-item
            to="/page/releases">
            Releases
          </b-dropdown-item>

          <b-dropdown-item
            to="/page/services">
            Monarch Web Services
          </b-dropdown-item>

          <b-dropdown-item
            to="/about/sources">
            Data Sources
          </b-dropdown-item>

        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav
        class="ml-auto">
        <div
          v-if="this.$route.path !== '/'"
          class="nav-ac">
          <monarch-autocomplete/>
        </div>
      </b-navbar-nav>
    </b-collapse>

    <b-navbar-toggle
      target="nav_collapse"/>

  </b-navbar>

</template>

<script>
import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';

export default {
  name: 'MonarchNavbar',
  components: {
    MonarchAutocomplete
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import "../style/variables.scss";

nav#monarchng-navbar.navbar .navbar-brand {
  height: $navbar-height;
  padding: 0;
  margin: 0 20px 0 0;
}

nav#monarchng-navbar.navbar .navbar-brand .branding-logo {
  height: 26px;
  width: auto;
  margin: 0;
  padding: 0;
}

nav#monarchng-navbar.navbar .navbar-collapse > .navbar-nav {
}

nav#monarchng-navbar.navbar .navbar-collapse > .navbar-nav > .nav-item {
  xvertical-align:middle;
}

nav#monarchng-navbar.navbar .navbar-collapse > .navbar-nav > .nav-item > .nav-link {
  xpadding:0;
  xmargin:0;
}

nav#monarchng-navbar.navbar .navbar-toggle {
  margin: 2px 35px 0 10px;
  padding: 1px;
}

nav#monarchng-navbar.navbar .navbar-toggler {
  padding: 2px 10px;
}

nav#monarchng-navbar.navbar .navbar-toggle .icon-bar {
  margin: 3px;
}

#monarchng-navbar {
  background-image: -webkit-linear-gradient(left, #0B556B 0%, #232733 100%) !important;
  background-image: linear-gradient(to right, #0B556B 0%, #232733 100%) !important;
  background-repeat: repeat-x !important;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffdfdfdf', GradientType=0) !important;
}

.nav-ac {
  margin:1px 25px 1px 0;
  height: 30px;
}
</style>

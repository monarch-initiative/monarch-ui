<template>

  <b-navbar
    id="monarchng-navbar"
    class="fixed-top"
    fixed="true"
    toggleable="sm"
    type="dark"
    variant="info">
    <b-navbar-brand to="/">
      <img
        class="branding-logo"
        src="../assets/img/monarch-logo-white.png"
        alt="Monarch Initiative logo"
        title="Monarch Initiative front page">
    </b-navbar-brand>
    <b-collapse
      id="nav_collapse"
      is-nav="">
      <b-navbar-nav>
        <b-nav-item-dropdown text="Tools">
          <b-dropdown-item
            to="/analyze/phenotypes">
            Phenotype Profile Search
          </b-dropdown-item>

          <b-dropdown-item to="/tools/text-annotate">
            Text Annotator
          </b-dropdown-item>

          <b-dropdown-item to="/tools/other-tools">
            Other Monarch Tools
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="About">
          <b-dropdown-item to="/about/monarch">
            About Monarch
          </b-dropdown-item>

          <b-dropdown-item to="/about/team">
            Our Team
          </b-dropdown-item>

          <b-dropdown-item href="https://medium.com/@MonarchInit" target="_blank" rel="noopener noreferrer">
            Disclaimer
          </b-dropdown-item>

          <b-dropdown-divider/>

          <b-dropdown-item to="/sources">
            Data Sources
          </b-dropdown-item>

          <b-dropdown-item to="/sources">
            Monarch API
          </b-dropdown-item>

          <b-dropdown-item to="/sources">
            Releases
          </b-dropdown-item>

          <b-dropdown-item href="https://archive.monarchinitiative.org/latest/" target="_blank" rel="noopener noreferrer">
            Data Downloads
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Documentation">
          <b-dropdown-item to="/documentation/publications">
            Publications
          </b-dropdown-item>

          <b-dropdown-item href="https://github.com/monarch-initiative" target="_blank" rel="noopener noreferrer">
            GitHub Organization
          </b-dropdown-item>

          <b-dropdown-item href="https://medium.com/@MonarchInit/how-to-annotate-a-patients-phenotypic-profile-afc5773d6cdb" target="_blank" rel="noopener noreferrer">
            Phenotype Curation Guidelines
          </b-dropdown-item>

          <b-dropdown-item href="https://github.com/obophenotype/upheno" target="_blank" rel="noopener noreferrer">
            Phenotype Ontologies Project
          </b-dropdown-item>

        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Help">
          <b-dropdown-item to="/help/contact">
            Contact Us
          </b-dropdown-item>

          <b-dropdown-item to="/help/citing">
            Cite Monarch
          </b-dropdown-item>

          <b-dropdown-item to="/help/linkout">
            Link to Monarch
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Examples">
          <b-dropdown-item to="/phenotype/HP:0001994#disease">
            Phenotype: Renal Fanconi syndrome HP:0001994
          </b-dropdown-item>

          <b-dropdown-item to="/disease/MONDO:0007669#phenotype">
            Disease: renal cysts and diabetes syndrome MONDO:0007669
          </b-dropdown-item>
          <b-dropdown-item to="/disease/MONDO:0007947">
            Disease: Marfan syndrome MONDO:0007947
          </b-dropdown-item>

          <b-dropdown-item to="/disease/OMIM:105830">
            Disease: Angelman syndrome OMIM:105830
          </b-dropdown-item>

          <b-dropdown-item to="/disease/MONDO:0007739#gene">
            Disease: Huntington disease MONDO:0007739
          </b-dropdown-item>

          <b-dropdown-item to="/disease/MONDO:0010935">
            Disease: neuronopathy, distal hereditary motor, type 5A MONDO:0010935
          </b-dropdown-item>

          <b-dropdown-item to="/disease/OMIMPS:PS120435">
            Disease: Colorectal cancer, hereditary nonpolyposis OMIMPS:PS120435 (no superclass)
          </b-dropdown-item>

          <b-dropdown-item to="/disease/MONDO:0010156">
            Disease: Troyer Syndrome MONDO:0010156
          </b-dropdown-item>
          <b-dropdown-divider/>
          <b-dropdown-item to="/gene/MGI:2447362#model">
            Gene: Slc24a4 <em>Mus musculus</em> MGI:2447362 (models)
          </b-dropdown-item>

          <b-dropdown-item to="/gene/HGNC:11773">
            Gene: TGFBR2 <em>Homo sapiens</em> HGNC:11773
          </b-dropdown-item>

          <b-dropdown-item to="/gene/HGNC:11180">
            Gene: SOD2 <em>Homo sapiens</em> HGNC:11180
          </b-dropdown-item>

          <b-dropdown-item to="/gene/ZFIN:ZDB-GENE-980526-333">
            Gene: sox3 <em>Danio rerio</em> ZFIN:ZDB-GENE-980526-333
          </b-dropdown-item>

          <b-dropdown-item to="/gene/NCBIGene:428534">
            Gene: SOX17 <em>Gallus gallus</em> NCBIGene:428534
          </b-dropdown-item>
          <b-dropdown-divider/>
          <b-dropdown-item to="/publication/PMID:28650316">
            Publication: The Na<sup>+</sup>/Ca<sup>2+</sup>, K<sup>+</sup> exchanger NCKX4 is required for efficient cone-mediated vision. PMID:28650316
          </b-dropdown-item>

          <b-dropdown-item to="/pathway/REACT:R-MMU-425561">
            Pathway: Sodium/Calcium exchangers REACT:R-MMU-425561
          </b-dropdown-item>

          <b-dropdown-item to="/pathway/REACT:R-SSC-381753">
            Pathway: Olfactory Signaling Pathway REACT:R-SSC-381753
          </b-dropdown-item>
          <b-dropdown-item to="/pathway/REACT:R-RNO-1461973">
            Pathway: Defensins REACT:R-RNO-1461973
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav
        class="ml-auto">
        <div
          v-if="this.$route.path !== '/'"
          class="nav-ac">
          <monarch-autocomplete :full-width-search="true"/>
        </div>
      </b-navbar-nav>
    </b-collapse>

    <b-navbar-toggle target="nav_collapse"/>
    <div v-b-popover.hover.v-danger.bottomleft="'The Monarch Initiative is in the process of creating a new experience for you. We are currently assessing UI functionality and data quality, if you believe you see an issue or want to suggest content please see the footer of this page.'"
         title="Monarch UI BETA"
         v-if="this.$route.path !== '/' && getEnvironment() === 'development' || getEnvironment() === 'beta'"
         class="beta">
      BETA
    </div>
  </b-navbar>

</template>

<script>
import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';
import * as biolinkService from '@/api/BioLink';
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
    getEnvironment() {
      return biolinkService.getCurrentServerEnvironment();
    }
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
  height: 28px;
  width: auto;
  margin: 15px 0 0 0;
  padding: 0;
}

nav#monarchng-navbar.navbar .navbar-collapse > .navbar-nav > .nav-item {
  xvertical-align:middle;
  margin-right: 15px;
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
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

.nav-ac {
  margin:1px 25px 1px 0;
  height: 30px;
}

.beta {
  padding: 18px;
  background-color: red;
  color: white;
  border-bottom: solid 2px ghostwhite;
  font-style: oblique;
  cursor: default;
  font-weight: bolder;
}
</style>

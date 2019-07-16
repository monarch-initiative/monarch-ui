<template>
  <div>
    <!--
      This code can probably be refactored so there is less duplication
      between the Compact and the Home layouts.
    -->
    <div v-if="compact" class="row footer compact">
      <div class="col-lg-4 version">
        <router-link to="/about/monarch">
          <i>The Monarch Initiative {{version}}</i>
        </router-link>
      </div>
      <div class="offset-lg-1 col-3">
          <b-button class="issue-btn" target="_blank" href="https://github.com/monarch-initiative/helpdesk/issues">
            Report Issue or Suggest Content
          </b-button>
      </div>
      <div class="col-lg-4 copyright">
        <i class="fa fa-creative-commons fa-fw"/>
        CC-BY 3.0, except where noted.
      </div>

    </div>

    <div
      v-else
      class="row footer">
      <div class="col-lg-2">
        <div class="media">
          <img
            class="img-fluid monarch-logo"
            src="../assets/img/monarch-logo-white-stacked.png"
            alt="Monarch logo">
        </div>
      </div>
      <div class="offset-lg-2 col-md-3 col-lg-2 about-section">
        <h5 class="category-header"> Tools </h5>
        <i class="fa fa-level-up fa-fw arrow-icon"/>
        <ul class="list-inline banner-social-buttons fa-ul">
          <li>
            <router-link to="/analyze/phenotypes">Phenotype Profile Search</router-link>
          </li>
          <li>
            <router-link to="/tools/other-tools">Other Tools</router-link>
          </li>
        </ul>
      </div>
      <div class="col-md-3 col-lg-2 about-section">
        <h5 class="category-header"> About </h5>
        <i class="fa fa-level-up fa-fw arrow-icon"/>
        <ul class="list-inline banner-social-buttons fa-ul">
          <li>
            <router-link to="/about/monarch">About Monarch</router-link>
          </li>
          <li>
            <router-link to="/about/team">Our Team</router-link>
          </li>
          <li>
            <router-link to="/sources">Disclaimer</router-link>
          </li>
          <li>
            <router-link to="/sources">Data Sources</router-link>
          </li>
          <li>
            <router-link to="/analyze/phenotypes">Monarch API</router-link>
          </li>
          <li>
            <router-link to="/analyze/phenotypes">Releases</router-link>
          </li>
          <li>
            <a href="https://archive.monarchinitiative.org/latest/" target="_blank">
              Data Downloads
            </a>
          </li>
        </ul>
      </div>
      <div class="col-md-3 col-lg-2 about-section">
        <h5 class="category-header"> Documentation </h5>
        <i class="fa fa-level-up fa-fw arrow-icon"/>
        <ul class="list-inline banner-social-buttons fa-ul">
          <li>
            <router-link to="/about/publications">Publications</router-link>
          </li>
          <li>
            <router-link to="/about/team">Github Organization</router-link>
          </li>
          <li>
            <router-link to="/analyze/phenotypes">Guidelines</router-link>
          </li>
          <li>
            <router-link to="/sources">Phenotype Ontologies</router-link>
          </li>
          <li>
            <router-link to="/analyze/phenotypes">Project</router-link>
          </li>
        </ul>
      </div>
      <div class="col-md-3 col-lg-2 about-section">
        <h5 class="category-header"> Help </h5>
        <i class="fa fa-level-up fa-fw arrow-icon"/>
        <ul class="list-inline fa-ul">
          <li>
            <router-link to="/help/contact">Contact Us</router-link>
          </li>
          <li>
            <router-link to="/help/cite">Cite Monarch</router-link>
          </li>
          <li>
            <router-link to="/help/linkout">Link to Monarch</router-link>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  props: {
    compact: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      isCompact: true,
      version: process.env.VUE_APP_VERSION
    };
  },
};

</script>
<style lang="scss">
@import "~@/style/variables";

div.footer {
  margin: 0;
  padding: 20px 10px;

  width: 100%;
  text-align: center;
  color: white;
  background-color: $monarch-bg-color;
  box-shadow: 0px -3px 2px -1px rgba(0, 0, 0, 0.2), 0px 2px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);

  a {
    color: white;
  }

  .fa-ul > li {
    text-align: left;
  }

  .arrow-icon {
    z-index: 10000;
    float: left;
    transform: rotate(90deg);
    font-size: 18px;
  }

  .monarch-logo {
    max-height:100px;
    margin:auto;
    padding:5px 5px 5px 5px;
  }

  .category-header {
    text-align: left;
  }

  .about-section {
    padding-left: 25px;
    text-align: center;

    > ul > li > a {
      padding: 0;
      margin: 0;
      color: white;
    }

    @media (min-width:$grid-float-breakpoint) {
      .about-section {
        text-align: left;
        color: red;
      }
    }
  }

  .version {
    padding: 10px 0 0 15px;
  }
  
  .copyright {
    text-align: right;
    padding: 10px 15px 0 0;
  }

  .issue-btn {
    &:active {
      background-color: #b4c2cf !important;
      border-color: #ffff !important;
    }
    color: #fff;
    background-color: #15556a;
    border-color: #ffff;
  }
}

div.footer.compact {
  min-height: $footer-height;
  margin: 0;
  padding: 5px 0;

  font-size: 0.875rem;
  text-align: left;
  background-color: $monarch-bg-color;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12)
}

</style>

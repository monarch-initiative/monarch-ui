<template>
  <div>
    <!--
      This code can probably be refactored so there is less duplication
      between the Compact and the Home layouts.
    -->
    <div v-if="compact" class="row footer compact">
      <div class="col-3">
        <i class="fa fa-creative-commons fa-fw"/>
        CC-BY 3.0, except where noted.
      </div>
      <div class="col-3">
        <a href="mailto:info@monarchinitiative.org">
          <i class="fa fa-envelope fa-fw"/>
        <span class="network-name">Contact Us</span></a>
      </div>
      <div class="col-3">
        <router-link to="/about/monarch">
          <i class="fa fa-info fa-fw"/>
          <span class="network-name">
            About Monarch
          </span>
        </router-link>
      </div>
      <div class="col-3">
        <a href="https://archive.monarchinitiative.org/latest/">
          <i class="fa fa-download fa-fw"/>
          <span class="network-name">
            Data Downloads
          </span>
        </a>
      </div>
    </div>

    <div v-else class="row footer">
      <div class="col-12 col-lg-3">
        <div class="media">
          <img class="img-fluid monarch-logo" src="../assets/img/monarch-logo-white-stacked.png" alt="Monarch logo">
        </div>
      </div>
      <div class="offset-lg-2 col-12 col-md-4 col-lg-2 about-section">
        <h6 class="category-header"> Contact Us </h6>
        <ul class="list-inline banner-social-buttons fa-ul">
          <li>
            <a href="mailto:info@monarchinitiative.org"><i class="fa fa-envelope fa-fw"/>Mail</a>
          </li>
          <li>
            <a target="_blank"
              href="https://github.com/monarch-initiative/"><i class="fa fa-github fa-fw"/>Github</a>
          </li>
          <li>
            <a target="_blank"
              href="https://twitter.com/MonarchInit"><i class="fa fa-twitter fa-fw"/>Twitter</a>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-4 col-lg-2 about-section">
        <h6 class="category-header"> About </h6>
        <ul class="list-inline fa-ul">
          <li>
            <router-link to="/about/monarch"><i class="fa fa-info fa-fw"/>About Monarch</router-link>
          </li>
          <li>
            <router-link to="/about/team"><i class="fa fa-users fa-fw"/>Team</router-link>
          </li>
          <li>
            <router-link to="/about/disclaimer"><i class="fa fa-file fa-fw"/>Disclaimer</router-link>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-4 col-lg-2 about-section">
        <h6 class="category-header"> Data </h6>
        <ul class="list-inline fa-ul">
          <li>
            <a href="https://archive.monarchinitiative.org/latest/"><i class="fa fa-download fa-fw"/>Data Downloads</a>
          </li>
          <li>
            <router-link to="/page/releases"><i class="fa fa-folder-open fa-fw"/>Releases</router-link>
          </li>
          <li>
            <router-link to="/page/services"><i class="fa fa-database fa-fw"/>APIs</router-link>
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

  a {
    color: white;
  }

  .fa-ul {
    margin-left: 4.14286em !important;
  }
  .fa-ul > li {
    text-align: justify;
  }

  .fa-ul li i {
    margin-right: 15px;
  }

  .category-header {
    text-align: center;
  }
  .monarch-logo {
    max-height:100px;
    margin:auto;
    padding:5px 5px 5px 5px;
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
}

div.footer.compact {
  min-height: $footer-height;
  margin: 0;
  padding: 5px 0;

  font-size: 0.875rem;
  text-align: left;
  background-color: $monarch-bg-color;
}

</style>

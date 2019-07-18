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
      <div class="col-4 col-lg-2">
        <div class="media">
          <img
            class="img-fluid monarch-logo"
            src="../assets/img/monarch-logo-white.png"
            alt="Monarch logo">
        </div>
      </div>

      <div class="socials col-8 col-lg-10">
        <div class="icons">
          <a href="mailto:info@monarchinitiative.org">
            <i class="fa fa-envelope fa-fw"/>
          </a>
          <a target="_blank" href="https://twitter.com/MonarchInit">
            <i class="fa fa-twitter fa-fw"/>
          </a>
          <a target="_blank" href="https://github.com/monarch-initiative/">
            <i class="fa fa-github fa-fw"/>
          </a>
        </div>
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
  padding: 0 10px;
  height: $footer-height;
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

  .socials .icons {
    float:right;
    i {
      font-size: 28px;
      margin: 15px 15px 0 0;
    }

    i:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }

  .monarch-logo {
    width: 150px;
    margin: 10px 15px 0 0;
    padding: 5px 5px 5px 5px;
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
  padding: 15px 0 5px 0;

  font-size: 0.875rem;
  text-align: left;
  background-color: $monarch-bg-color;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12)
}

</style>

<template>
  <div class="home-footer row">
    <div class="col-12 col-lg-3">
      <div class="media">
        <img
          class="img-fluid monarch-logo"
          src="../assets/img/monarch-logo-white-stacked.png"
          alt="Monarch logo">
      </div>
    </div>
    <div class="col-12 col-md-4 col-lg-3 about-section">
      <h6> Contact Us </h6>
      <ul class="list-inline banner-social-buttons">
        <li>
          <a href="mailto:info@monarchinitiative.org"><i class="fa fa-envelope fa-fw"/> <span class="network-name">Mail</span></a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://github.com/monarch-initiative/"><i class="fa fa-github fa-fw"/> <span class="network-name">Github</span></a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://twitter.com/MonarchInit"><i class="fa fa-twitter fa-fw"/> <span class="network-name">Twitter</span></a>
        </li>
        <!--li>
          <a href="mailto:info@monarchinitiative.org"><i class="fa fa-envelope-square fa-fw"></i> <span class="network-name">List</span></a>
        </li-->
      </ul>
    </div>
    <div class="col-12 col-md-4 col-lg-3 about-section">
      <h6> About </h6>
      <ul class="list-inline">
        <li>
          <router-link to="/about/monarch"><i class="fa fa-info fa-fw"/>  <span class="network-name">About Monarch</span></router-link>
        </li>
        <li>
          <router-link to="/about/team"><i class="fa fa-users fa-fw"/> <span class="network-name">Team</span></router-link>
        </li>
        <li>
          <router-link to="/about/disclaimer"><i class="fa fa-file fa-fw"/> <span class="network-name">Disclaimer</span></router-link>
        </li>
      </ul>
    </div>
    <div class="col-12 col-md-4 col-lg-3 about-section">
      <h6> Data </h6>
      <ul class="list-inline">
        <li>
          <a href="https://archive.monarchinitiative.org/latest/"><i class="fa fa-download fa-fw"/> <span class="network-name">Data Downloads</span></a>
        </li>
        <li>
          <router-link to="/page/releases"><i class="fa fa-folder-open fa-fw"/> <span class="network-name">Releases</span></router-link>
        </li>
        <li>
          <router-link to="/page/services"><i class="fa fa-database fa-fw"/> <span class="network-name">APIs</span></router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "~@/style/variables";

div.home-footer {
  margin: 0px;
  padding: 20px 10px;

  width: 100%;
  text-align: center;
  color: white;
  background-color: $monarch-bg-color;

  a {
    color: white;
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


</style>

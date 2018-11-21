<!-- Why no self-closing tags? https://github.com/QingWei-Li/vue-markdown-loader/issues/56 -->
<div class="row footer">
  <div class="col-3">
    <i class="fa fa-creative-commons fa-fw"></i>
    CC-BY 3.0, except where noted.
  </div>
  <div class="col-3">
    <a href="mailto:info@monarchinitiative.org">
      <i class="fa fa-envelope fa-fw"></i>
    <span class="network-name">Contact Us</span></a>
  </div>
  <div class="col-3">
    <router-link to="/page/about">
      <i class="fa fa-info fa-fw"></i>
      <span class="network-name">
        About Monarch
      </span>
    </router-link>
  </div>
  <div class="col-3">
    <a href="https://archive.monarchinitiative.org/latest/">
      <i class="fa fa-download fa-fw"></i>
      <span class="network-name">
        Data Downloads
      </span>
    </a>
  </div>
</div>


<style lang="scss">
@import "~@/style/variables";

div.footer {
  margin: 0px;
  padding: 0;

  font-size: 0.875rem;
  text-align: left;
  color: white;
  background-color: $monarch-bg-color;

  a {
    color: white;
  }
}

</style>

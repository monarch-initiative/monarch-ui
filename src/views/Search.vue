<template>
  <div id="selenium_id_content">
    <div
      id="monarch-home-container"
      class="container-fluid monarch-container">
      <header class="intro">
        <div class="intro-body">
          <div class="container">
            <div class="row">
              <!--<div class="col-md-12">-->
              <!--<div class="brand-heading m-0 p-0">-->
              <!--<img-->
              <!--class="center-block text-center img-fluid"-->
              <!--style="max-height:80px;"-->
              <!--src="../assets/img/monarch-logo-white-stacked.png">-->
              <!--</div>-->
              <!--</div>-->
              <div
                class="col-md-12 py-2">
                <p class="intro-text">
                  Search Results
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>


      <section
        id="features"
        class="features-section text-center">
        <div class="container-fluid">
          <div class="col-sm">
            Bllep Bleep Blooip
            <!--<h2>What We Do</h2>-->
            <!--<ul style="list-style-type:none;">-->
              <!--<li>Integrate, align, and re-distribute cross-species gene, genotype, variant, disease, and phenotype data.</li>-->
              <!--<li>Provide a portal for exploration of phenotype-based similarity.</li>-->
              <!--<li>Facilitate identification of animal models of human disease through phenotypic similarity.</li>-->
              <!--<li>Enable quantitative comparison of cross-species phenotypes.</li>-->
              <!--<li>Develop embeddable widgets for data exploration.</li>-->
              <!--<li>Influence genotype and phenotype reporting standards.</li>-->
              <!--<li>Improve ontologies to better curate genotype-phenotype data.</li>-->
            <!--</ul>-->

            <!--<router-link-->
              <!--to="/page/about"-->
              <!--class="btn btn-dark">-->
              <!--<span>Learn More</span>-->
            <!--</router-link>-->

          </div>
        </div>
      </section>


      <footer class="footer">
        <home-footer/>
      </footer>

    </div>
  </div>
</template>


<script>
import HomeFooter from '@/components/HomeFooter.vue';

export default {
  name: 'Search',
  components: {
    'home-footer': HomeFooter
  },
  data() {
    return {};
  },
  mounted() {
  }
};

</script>


<style lang="scss">
    @import "~@/style/variables";
</style>

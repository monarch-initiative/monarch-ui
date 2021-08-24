<div class="container-fluid monarch-view monarch-about-view">
  <h2 class="page-title">The Monarch Initiative</h2>
  <div class="top-section col-12">
    <p>
      The Monarch Initiative is an integrative data and analytic platform
      connecting phenotypes to genotypes across species, bridging basic and
      applied research with semantics-based analysis. The correlation of
      phenotypic outcomes and disease with genetic variation and environmental
      factors is a core pursuit in biology and biomedicine. We have created or
      currently contribute to many essential bio-ontologies that together enable
      sophisticated and semantically integrated computational analysis across
      gene, genotype, variant, disease, and phenotype data. We have developed
      algorithms and tools that are in use by multiple communities for tasks
      including the identification of animal models of human disease through
      phenotypic similarity, phenotype-driven computational support for
      differential diagnostics, and translational research.
    </p>
  </div>
  <div class="row">
    <div class="col-12 col-lg-6">
      <figure class="cross-species">
        <img src="../assets/img/phenotype-cov-hum-6.png" />
        <figcaption class="phenotype-coverage">
          Fig 1. Model organisms provide key insight into phenotypic
          manifestations of human coding genes. Human coding genes with
          disease/phenotype-causing mutations are shown on the left; model
          organism orthologs of human coding genes with associated phenotypes
          are on the right. By including just 5 species, we can boost coverage
          by 61%, up to ~82% of human protein coding genes reported by the HUGO
          Gene Nomenclature Committee (HGNC). There are 33 sources of data
          integrated within the Monarch Initiative.
        </figcaption>
      </figure>
    </div>
    <div class="col-12 col-lg-5">
      <figure class="comparison">
        <img src="../assets/img/cross-species-comparison.png" />
        <figcaption>
          Fig 2. Comparison of PAX6 abnormal phenotypes in human and model
          organism eyes. (Image from
          <a
            href="http://www.plosbiology.org/article/info%3Adoi%2F10.1371%2Fjournal.pbio.1000247"
            target="__blank"
            >Washington et al, 2009)</a
          >
        </figcaption>
      </figure>
    </div>
  </div>

  <div class="goals-banner offset-2 col-8">
    <h3 id="our-goals"><strong>Monarch's Vision</strong></h3>
    <div id="our-goals-list">
      <p>
        Integrate, align, and re-distribute cross-species gene, genotype,
        variant, disease, and phenotype data
      </p>
      <p>Provide a portal for exploration of phenotype-based similarity</p>
      <p>
        Facilitate identification of animal models of human disease through
        phenotypic similarity
      </p>
      <p>Enable quantitative comparison of cross-species phenotypes</p>
      <p>Develop embeddable widgets for data exploration</p>
      <p>Influence genotype and phenotype reporting standards</p>
      <p>Improve ontologies to better curate genotype-phenotype data</p>
    </div>
  </div>
  <br /><br />
  <p>
    We lead the development of the
    <a href="https://hpo.jax.org/">Human Phenotype Ontology</a>, which is used
    across the world for genomic diagnostics in genetic disease and other areas.
    We are a Driver Project for the
    <a href="https://www.ga4gh.org/" target="__blank"
      >Global Alliance for Genomics and Health</a
    >
    (GA4GH), and are major contributors to the development of genomics standards
    within GA4GH. Additionally, we have developed
    <a href="http://obofoundry.org/ontology/mondo.html" target="__blank"
      >Mondo</a
    >, a unified disease ontology that represents the most comprehensive
    integration of disease entities ever achieved.
  </p>
  <div class="row">
    <div class="col-12 col-lg-6">
      <figure class="ecosystems">
        <img src="../assets/img/HPO-figure-for-monarchui.png" />
        <figcaption>
          Fig 3. The
          <a href="https://hpo.jax.org" target="__blank"
            >Human Phenotype Ontology</a
          >
          (HPO) provides a standardized vocabulary of phenotypic abnormalities
          encountered in human disease.
          <a href="https://pubmed.ncbi.nlm.nih.gov/30476213/" target="__blank"
            >More about HPO...</a
          >
        </figcaption>
      </figure>
    </div>
    <div class="col-12 col-lg-6">
      <figure class="ecosystems phenopackets">
        <img src="../assets/img/phenopackets-ecosystem2.png" />
        <figcaption>
          Fig 4.
          <a href="http://phenopackets.org/" target="__blank">Phenopackets</a>
          is a standard exchange format for phenotypes and environmental
          factors. This packet of phenotype data can be used anywhere, and can
          be written by anyone. This work is being done in collaboration with
          the
          <a href="https://www.ga4gh.org/" target="__blank"
            >Global Alliance for Genomics and Health (GA4GH)</a
          >.
        </figcaption>
      </figure>
    </div>
  </div>
  <!--<div class="callouts row">
    <h4 class="title">
        Check out some of our tools and resources below!
    </h4>
    <b-card-group class="col-lg-12">
        <b-card title="Phenotype Profile Search" class="col-12 col-lg-6">
            <b-card-text>
              Targeted search based off a list of phenotypes. 
            </b-card-text>
            <router-link to="/analyze/phenotypes">
                <b-button class="card-btn">Search <i class="fa fa-caret-right"></b-button>
            </router-link>
          </b-card>
          <b-card title="Monarch Web Services" class="col-12 col-lg-6">
              <b-card-text>
                Developer friendly API's for the initiative's data.
              </b-card-text>
              <router-link to="/about/monarch-web-services">
                <b-button class="card-btn">Learn More<i class="fa fa-caret-right"></b-button>
              </router-link>
          </b-card>
    </b-card-group deck>
</div>-->
</div>

<style lang="scss">
  @import "~@/style/variables";

  .container-fluid.monarch-view.monarch-about-view {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      clear: both;
    }

    .monarch-hr {
      border-top-color: $monarch-bg-color;
      border-top-width: 2px;
    }

    .goals-banner {
      padding: 20px;
      height: auto;
      margin-top: 25px;
      color: white;
      background-color: $monarch-bg-color;
      border-radius: 0.5rem;
      text-align: center;
    }
    figure {
      margin: 0 auto;
    }
    .callouts {
      margin: 50px 0 50px;

      .title {
        text-align: center;
        width: 100%;
      }
      .card {
        text-align: center;
        background-color: #0b556b;
        margin-right: 15px;
        color: white;
        border-radius: 0.5rem !important;
        .card-btn {
          background-color: $monarch-button-color;
          color: black;
        }
      }
    }

    figure {
      display: table;

      &.comparison {
        img {
          max-width: 500px;
        }
      }
      &.cross-species {
        img {
          max-width: 650px;
        }
      }

      &.ecosystems {
        img {
          max-width: 650px;
        }

        &.phenopackets img {
          max-width: 750px;
        }
      }
      img {
        padding: 15px;
        height: auto;
        width: 100%;
      }
    }

    .right {
      float: right;
    }

    .left {
      float: left;
    }

    .center {
      margin-left: auto;
      margin-right: auto;
      vertical-align: middle;
      text-align: center;
    }

    .bottomright {
      float: right;
      position: relative;
      bottom: 0;
      right: 0;
    }

    figcaption {
      text-align: justify;
      font-size: 12px;
      word-wrap: normal;
      display: table-caption;
      caption-side: bottom;
      padding: 0 10px 5px;
      line-height: 16px;
    }

    .figure-title {
      text-align: center;
      font-weight: bold;
    }

    table {
      margin: auto;
      text-align: center;
      td a img {
        max-width: 120px;
        margin: 5px;
      }

      @media (min-width: $grid-float-breakpoint) {
        td a img {
          max-width: 200px;
        }
      }
    }
    .phenotype-coverage {
    }
  }
</style>

<script>
  export default {
    name: "AboutMonarch",
    components: {}
  };
</script>

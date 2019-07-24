<div class="container-fluid monarch-view monarch-about-view">

<h2 class="page-title">The Monarch Initiative</h2>
<div class="row">

<p>The Monarch Initiative is an integrative data and analytic platform connecting phenotypes to genotypes across 
species, bridging basic and applied research with semantics-based analysis. The correlation of phenotypic outcomes 
and disease with genetic variation and environmental factors is a core pursuit in biology and biomedicine.</p>
 
</div>
<div class="row">
    <div class="col-lg-6">
        <h5 class="figure-title">The phenotype annotation coverage of human coding genes.</h4>
        <figure class="cross-species">
          <img src="../assets/img/cross-species.jpeg" style="max-height:300px;" />
          <figcaption>
           Fig 1. This figure shows the availability of curated phenotypes that have been attributed to human genes 
           (directly or inferred via orthology) across a range of model organisms (teal circle). Phenotypes for human 
           genes curated in humans are shown in green, and they only represent 20% of the total number of protein-coding 
           genes in the human genome (HGNC, 07-2019). Data from more species raises the phenotypic coverage of human 
           coding genes to 82%.
          </figcaption>
        </figure>
    </div>
    <div class="col-lg-6">
         <h5 class="figure-title">Cross specific phenotype comparison.</h5>
         <figure>
          <img src="../assets/img/cross-species-comparison.png" style="max-height:375px;" />
          <figcaption>
           Fig 2. Comparison of PAX6 abnormal phenotypes in human and model organism eyes. 
           (Image from <a href="http://www.plosbiology.org/article/info%3Adoi%2F10.1371%2Fjournal.pbio.1000247" target="__blank">Washington et al, 2009</a>
          </figcaption>
        </figure>
    </div>
</div>
<br><br>
<div class="row">
<p>We have created or currently contribute to many essential bio-ontologies that together enable sophisticated and 
semantically integrated computational analysis across gene, genotype, variant, disease, and phenotype data. We lead 
the development of the <a href="https://hpo.jax.org/">Human Phenotype Ontology</a>, which is used across the world for genomic 
diagnostics in genetic disease and other areas. We have created <a href="http://obofoundry.org/ontology/mondo.html" target="__blank">MONDO</a>, a unified disease ontology 
that represents the most comprehensive integration of disease entities ever achieved. We are a Driver Project for the 
<a href="https://www.ga4gh.org/" target="__blank">Global Alliance for Genomics and Health</a> (GA4GH), and are major contributors to the 
development of genomics standards within GA4GH. We have developed algorithms and tools that are in use by multiple 
communities for tasks including the identification of animal models of human disease through phenotypic similarity, 
phenotype-driven computational support for differential diagnostics, and translational research.</p>

</div>
<div class="callouts row">
    <h4 class="title">
        Checkout some of our tools and resources below!
    </h4>
    <b-card-group>
        <b-card title="Phenotype Profile Search" class="col-lg-4">
            <b-card-text>
              Targeted search based off a list of phenotypes. 
            </b-card-text>
            <router-link to="/about/monarch-api">
                <b-button class="card-btn">Search <i class="fa fa-caret-right"></b-button>
            </router-link>
          </b-card>
          <b-card title="Monarch API" class="col-lg-4">
              <b-card-text>
                Developer friendly API's for open source data.
              </b-card-text>
              <router-link to="/about/monarch-api">
                <b-button class="card-btn">Learn More <i class="fa fa-caret-right"></b-button>
              </router-link>
          </b-card>
          <b-card title="PhenoPackets" class="col-lg-4">
            <b-card-text>
              A standard to communicate bioinformation. 
            </b-card-text>
            <router-link to="/about/monarch-api">
              <b-button class="card-btn">Explore <i class="fa fa-caret-right"></b-button>
            </router-link>
          </b-card>
    </b-card-group deck>
</div>

</div>

<style lang="scss">
@import "~@/style/variables";

.container-fluid.monarch-view.monarch-about-view {
  h1, h2, h3, h4, h5, h6 {
    clear:both;
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
        background-color: #0B556B;
        margin-right: 15px;
        color: white;
        .card-btn {
            background-color: $monarch-button-color;
            color: black;
        }
    }
  
  }

  .cross-species img {
    margin-top: 25px;
    margin-bottom: 25px;
  }
  figure {
    display:table;

    img {
      padding:15px;
    }
  }

  .right {
    float:right;
  }

  .left {
    float:left;
  }

  .center {
    margin-left:auto;
    margin-right:auto;
    vertical-align:middle;
    text-align:center;
  }

  .bottomright {
    float:right;
    position:relative;
    bottom:0;
    right:0;
  }

  figcaption {
    text-align:justify;
    font-size:12px;
    word-wrap:normal;
    display:table-caption;
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

    @media(min-width:$grid-float-breakpoint) {
      td a img {
        max-width: 200px;
      }
    }
  }

}

</style>

<script>
export default {
  name: 'AboutMonarch',
  components: {
  },
};
</script>

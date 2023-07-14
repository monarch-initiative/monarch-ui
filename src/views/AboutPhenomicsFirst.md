<div class="container-fluid monarch-view monarch-about-view">

<h2 class="page-title">Phenomics First</h2>
<div class="top-section col-12">
    <p>Understanding genomic variation is key to precision medicine; however, despite the ease of sequencing, clinical interpretation is still thwarted because available variant-phenotype association data is complex, heterogeneous, and disaggregated across sources. Moreover, this evidence is sometimes incomplete, conflicting, and erroneous. Consequently, clinicians face long lists of candidate diseases, genes, and countless variants of unknown significance. Indeed, the efficiency and affordability of sequencing data has shifted the bottleneck to interpretation, based largely on these phenotype resources. The Monarch Initiative is developing a community Phenomics-First Resource (PFR) to advance the emerging field of phenomics; its initial focus will be improving the phenotype data that supports variant prioritization in genetic disease diagnosis. Our approach is modeled on the Gene Ontology (GO). GO is the standard for describing gene function, and it benefits from active community use and development. The PFR will provide an overarching complementary solution for phenotypes—the higher-level outcomes of gene function/dysfunction. Our approach acknowledges the complexity of phenomics: currently, curated phenotype data is scattered across multiple databases with different standards (exchange formats, database schemas, and ontologies). More than 100 organizations curate human diseases and their attributes: phenotypes, genes, variants, frequency, treatments, etc. Dozens more curate model organism phenotypes. The PFR will provide a framework to fundamentally advance and simplify computational approaches for interpreting human genome variation. We are the creators of the Human Phenotype Ontology which has been the cornerstone of our pioneering work in data integration. We will leverage this to align phenotype ontologies and clinical terminologies, bringing major model species and clinical domains into the PFR, which we will refine through continual community partnership. We propose the following interlinked approaches that will provide a dynamic suite of community-developed knowledge resources to revolutionize variant interpretation applications and drive precision medicine.
    </p>
</div>

<div class="goals-banner offset-2 col-8">
  <h3 id="our-goals"><strong>Phenomics First Goals</strong></h3>
  <p>The Phenomics First Resource comprises 3 major sub-components which are integrated into a common platform to transform variant interpretation and drive precision medicine.</p>
  <div id="our-goals-list">
     <p>Create a community-driven framework of interoperable phenotype definitions: The Unified Phenotype Ontology (uPheno)</p>
     <p>Harmonize human disease definitions: the Mondo Disease Ontology</p>
     <p>Create a community-wide phenotype exchange standard: Phenopackets</p>
  </div>
</div>
<br><br>
<div class="row">
    <div class="col-12 col-lg-6">
        <figure class="ecosystems">
              <img src="../assets/img/pfr.png"/>
              <figcaption>
              Fig 3. The <a href="https://hpo.jax.org" target="__blank">The Phenomics First Project</a> (HPO) provides a standardized vocabulary of 
              phenotypic abnormalities encountered in human disease. 
              <a href="https://pubmed.ncbi.nlm.nih.gov/30476213/" target="__blank">More about HPO...</a>
              </figcaption>
        </figure>
    </div>
    <div class="col-12 col-lg-6">
        <figure class="ecosystems phenopackets">
              <img src="../assets/img/phenopackets-ecosystem2.png"/>
              <figcaption>
               Fig 4. <a href="http://phenopackets.org/" target="__blank">Phenopackets</a> is a standard 
               exchange format for phenotypes and environmental factors. This packet of phenotype data can be used 
               anywhere, and can be written by anyone. This work is being done in collaboration with the <a href="https://www.ga4gh.org/" target="__blank">Global 
               Alliance for Genomics and Health (GA4GH)</a>. 
              </figcaption>
        </figure>
    </div>
</div>
<div>
<h3>The Unified Phenotype Ontology (uPheno)</h3>
<p>
The Unified Phenotype Ontology (uPheno) is an effort led by the Monarch Initiative to integrate phenotype terminologies across species. uPheno has to major components: an OWL ontology that imports and deeply integrates phenotype ontologies from a variety of species, including Human and several major model organisms (such as Drosophila, Zebrafish, Xenopus, C. elegans, and Mouse), and a library of phenotype ontology term templates that are developed by the <a href="https://github.com/obophenotype/upheno/wiki/Phenotype-Ontologies-Reconciliation-Effort">Phenotype Ontologies Reconciliation Effort</a>.
</p>
</div>
<div>
<h3>The Mondo Disease Ontology (Mondo)</h3>
<p>
.
</p>
</div>
<div>
<h3>Phenopackets</h3>
<p>
.
</p>
</div>
<div>
<h3>The Phenomics First Resource</h3>
<p>
.
</p>
</div>
</div>

<style lang="scss">
@import "~@/style/variables";

.container-fluid.monarch-view.monarch-about-view {
  h1, h2, h3, h4, h5, h6 {
    clear:both;
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
        background-color: #0B556B;
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
    display:table;
    
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
      padding:15px;
      height: auto;
      width: 100%;
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
    .phenotype-coverage {
        
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

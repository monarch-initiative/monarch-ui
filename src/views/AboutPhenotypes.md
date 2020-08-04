<div class="container-fluid monarch-view about-phenotypes">

## About Phenotypes

A phenotype is an observable trait, such as height, eye color, and blood type. Phenotypes arise from the complex interplay of genetic and environmental factors. A phenotype profile is a collection of phenotypes for an individual organism at a given time. In the case of a disease, the corresponding phenotypes are commonly referred to as signs and symptoms such as fever, hypertension, or joint laxity.

When clinicians observe a cluster of individuals with similar phenotype profiles that do not match any known disease, they may describe these features in a scientific paper. Monarch curators and others have systematically read such papers and have extracted structured representations of the corresponding phenotypes for each known rare disease; the phenotype terms in these gold standard profiles are from the Human Phenotype Ontology.
</div>

<script>
export default {
  name: 'AboutPhenotypes',
  components: {
  },
};
</script>

<style lang="scss">
@import "~@/style/variables";

.container-fluid.monarch-view.about-phenotypes {
  h1, h2, h3, h4, h5, h6 {
    clear:both;
  }
  
  h2 {
    text-align: center;
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
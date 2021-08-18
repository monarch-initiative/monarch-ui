<div class="container-fluid monarch-view about-phenotypes">

  ## About Phenotypes

  A _phenotype_ is an observable trait, such as height, eye color, or blood type. Phenotypes arise from the complex interplay of genetic and environmental factors.

  A _phenotype profile_ is simply a collection of phenotypes, that are specific to an individual organism, and which occur at a given point in time. Diseases can also have a canonical presentation which can be represented as a phenotype profile. In the case of a disease, the corresponding phenotypes are commonly referred to as signs and symptoms such as fever, hypertension, or joint laxity.

  When clinicians observe a cluster of individuals with similar phenotype profiles that do not match any known disease, they may describe these features in a scientific paper.
  Monarch curators and others have systematically read such papers and have extracted structured representations of the corresponding phenotype profiles for each known rare disease; the phenotype terms in these gold standard profiles are from the Human Phenotype Ontology.

</div>

<script>
  export default {
    name: "AboutPhenotypes",
    components: {}
  };
</script>

<style lang="scss">
  @import "~@/style/variables";

  .container-fluid.monarch-view.about-phenotypes {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      clear: both;
    }

    h2 {
      text-align: center;
    }
  }
</style>

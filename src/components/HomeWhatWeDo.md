<div
  class="home-page-section features-section">

### What We Do

- Integrate, align, and re-distribute cross-species gene, genotype, variant, disease, and phenotype data.
- Provide a portal for exploration of phenotype-based similarity.
- Facilitate identification of animal models of human disease through phenotypic similarity.
- Enable quantitative comparison of cross-species phenotypes.
- Develop embeddable widgets for data exploration.
- Influence genotype and phenotype reporting standards.
- Improve ontologies to better curate genotype-phenotype data.

  <router-link
    to="/about/monarch"
    class="btn btn-dark">
    <span>Learn More</span>
  </router-link>
</div>


<style lang="scss">
@import "~@/style/variables";
@import "~@/style/home-page";

.features-section {
  width: 100%;
  text-align: center;
  padding: 15px;
  background-color: $home-section-dark-bg;

  ul {
    list-style-type: none;
    padding: 0 15px;

    li {
      line-height: 1.4rem;
    }
  }

  .btn.btn-dark {
    color: white;
    transition: all .3s ease-in-out;
  }
}

</style>

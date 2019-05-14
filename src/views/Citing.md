<div
  class="container-fluid monarch-view monarch-about-view">

#### Goals

<img
  id="monarch-logo-stacked"
  src="../assets/img/monarch-logo-black-stacked.png"
  align="right"
  style="height:120px;margin:20px;"/>

- Integrate, align, and re-distribute cross-species gene, genotype, variant, disease, and phenotype data
- Provide a portal for exploration of phenotype-based similarity
- Facilitate identification of animal models of human disease through phenotypic similarity
- Enable quantitative comparison of cross-species phenotypes
- Develop embeddable widgets for data exploration
- Influence genotype and phenotype reporting standards
- Improve ontologies to better curate genotype-phenotype data

Our philosophy is based on the premise that we want to *make all the data count*. Monarch isn’t just another database that slurps data from the typical places and renders it in a different format. We are driven to truly *integrate* biological information using semantics, and present it in a novel way, leveraging phenotypes to bridge the knowledge gap. Our niche is the use of computational reasoning to enable phenotype comparison both within and across species, with the ultimate goal of improving biomedical research.


 ## Proposed text for 'how to cite Monarch' page:
 Please acknowledge the use of Monarch with the following paragraph:
 {YOUR resource} uses and displays data and algorithms from the Monarch Initiative. The Monarch Initiative (https://monarchinitiative.org) makes biomedical knowledge exploration more efficient and effective by providing tools for genotype-phenotype analysis, genomic diagnostics, and precision medicine across broad areas of disease.
 
 To cite the use of Monarch in publications, please use these two references:
 Navigating the Phenotype Frontier: The Monarch Initiative. McMurry et al. GENETICS August 1, 2016 vol. 203 no. 4 1491-1495; DOI: 10.1534/genetics.116.188870
 The Monarch Initiative: an integrative data and analytic platform connecting phenotypes to genotypes across species. Mungall et al. Nucleic Acids Res. 2017 Jan 4; 45(Database issue): D712–D722. Published online 2016 Nov 29. doi: 10.1093/nar/gkw1128
 
 To cite a specific data page or result in Monarch:
 Because most of the association content in Monarch comes from external sources, we kindly ask that you please cite the original database records (e.g. http://www.informatics.jax.org/accession/MGI:1915196) or the original publications (e.g. PMID:25605924), as appropriate.
 
 If you wish to link from your site to a specific data page from the Monarch Initiative website, or link to algorithmic results as presented in Monarch, please do so using our permalinks (a.k.a. "HTTP URI"). The permalink for each data page starts with the Monarch URL https://monarchinitiative.org/ followed by the entity's prefixed accession (e.g. OMIM:154700); in this example, the permalink would be https://monarchinitiative.org/OMIM:154700.
 
 For example, the suggested citation for this record from OMIM at Monarch Initiative would be as follows:
 Prefixed Identifier: OMIM:154700
 http URI/permalink: https://monarchinitiative.org/OMIM:154700
 Suggested citation: Monarch Consortium. Accessed 2016-09-22. Marfan Syndrome. https://monarchinitiative.org/OMIM:154700
 
 The complete set of transformed data for a given source database can be found at http://data.monarchinitiative.org/ttl/
 
 Please note that the data in Monarch is constantly expanding and improving. The data is versioned with each database release, and archived database releases are available upon request. The evolution of individual records in Monarch is not currently tracked. More documentation about our identifiers can be found in GitHub, at https://github.com/monarch-initiative/dipper/blob/master/README.md#identifiers



| | | |
|:---|:---:|---:|
| [![NIH Undiagnosed Disease Program](../assets/img/partner-udp.png)](http://www.rarediseases.info.nih.gov/research/pages/27/undiagnosed-diseases-program) | [![Global Alliance](../assets/img/partner-globalalliance.jpg)](http://genomicsandhealth.org/) | [![International Rare Diseases Research Consortium](../assets/img/partner-irdirc.png)](http://www.irdirc.org/) |
| [![](../assets/img/partner-phenomecentral.png)](http://phenomecentral.org) | [![](../assets/img/partner-biolark.png)](http://bio-lark.org) | [![](../assets/img/partner-go.png)](http://www.geneontology.org) |
| [![PhenoTips](../assets/img/partner-phenotips.jpg)](https://phenotips.org) | [![Disease Ontology](../assets/img/partner-do.png)](http://www.disease-ontology.org) | [![Force11](../assets/img/partner-force11.png)](https://www.force11.org)

<about-footer></about-footer>
</div>


<style lang="scss">
@import "~@/style/variables";

.container-fluid.monarch-view.monarch-about-view {
  h1, h2, h3, h4, h5, h6 {
    clear:both;
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

<script>
export default {
  name: 'AboutMonarch',
  components: {
    'about-footer': require('@/components/Footer.md').default,
  },
};
</script>

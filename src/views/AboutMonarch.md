<div class="container-fluid monarch-view monarch-about-view">

<h2 class="page-title">The Monarch Initiative</h2>
<div class="row">

<p>The Monarch Initiative is an integrative data and analytic platform connecting phenotypes to genotypes across species. 
The correlation of phenotypic outcomes and disease with genetic variation and environmental factors is a core pursuit 
in biology and biomedicine.</p>
 
<p>We have created or currently contribute to many essential bio-ontologies that together enable sophisticated and 
semantically integrated computational analysis across gene, genotype, variant, disease, and phenotype data. We lead 
the development of the <a href="https://hpo.jax.org/">Human Phenotype Ontology</a>, which is used across the world for genomic 
diagnostics in genetic disease and other areas. We have created Mondo (linkto Mondo site), a unified disease ontology 
that represents the most comprehensive integration of disease entities ever achieved. We are a Driver Project for the 
<a href="https://www.ga4gh.org/" target="__blank">Global Alliance for Genomics and Health</a> (GA4GH), and are major contributors to the 
development of genomics standards within GA4GH. We have developed algorithms and tools that are in use by multiple 
communities for tasks including the identification of animal models of human disease through phenotypic similarity, 
phenotype-driven computational support for differential diagnostics, and translational research.</p>
</div>
<div class="row">
    <div class="col-lg-4">
        <figure>
          <img src="http://journals.plos.org/plosbiology/article/figure/image?id=10.1371/journal.pbio.1000247.g001&size=medium" style="max-height:300px;" />
          <figcaption>
           Fig 1. Comparison of PAX6 abnormal phenotypes in human and model organism eyes. 
           (Image from <a href="http://www.plosbiology.org/article/info%3Adoi%2F10.1371%2Fjournal.pbio.1000247" target="__blank">Washington et al, 2009</a>
          </figcaption>
        </figure>
        Find out more about cross specific phenotype analysis.
    </div>
    <div class="col-lg-4">
         <figure>
          <img src="http://journals.plos.org/plosbiology/article/figure/image?id=10.1371/journal.pbio.1000247.g001&size=medium" style="max-height:300px;" />
          <figcaption>
           Fig 1. Comparison of PAX6 abnormal phenotypes in human and model organism eyes. 
           (Image from <a href="http://www.plosbiology.org/article/info%3Adoi%2F10.1371%2Fjournal.pbio.1000247" target="__blank">Washington et al, 2009</a>
          </figcaption>
        </figure>
        Find out more about cross specific phenotype analysis.
    </div>
    <div class="col-lg-4">
             <figure>
              <img src="http://journals.plos.org/plosbiology/article/figure/image?id=10.1371/journal.pbio.1000247.g001&size=medium" style="max-height:300px;" />
              <figcaption>
               Fig 1. Comparison of PAX6 abnormal phenotypes in human and model organism eyes. 
               (Image from <a href="http://www.plosbiology.org/article/info%3Adoi%2F10.1371%2Fjournal.pbio.1000247" target="__blank">Washington et al, 2009</a>
              </figcaption>
            </figure>
            Find out more about cross specific phenotype analysis.
    </div>
</div>
<br><br>
<div class="row">
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac magna consectetur, aliquet est in, pretium libero.
 Vestibulum nibh turpis, placerat sit amet accumsan nec, euismod nec sapien. Mauris eu lacus sed ipsum pharetra feugiat.
  Nunc feugiat ornare malesuada. In tempor laoreet felis, nec egestas ex. Vestibulum convallis eros id diam eleifend, 
  vitae viverra eros auctor. Mauris mi est, egestas et enim vel, elementum fermentum enim. In ut tortor purus. 
  Vestibulum sit amet tellus lobortis, viverra augue congue, sollicitudin risus. Ut mi mauris, porttitor ut feugiat 
  quis, euismod eget quam. Fusce sagittis rhoncus lorem eu aliquet. Nullam dictum purus in magna sollicitudin, in 
  dapibus diam tristique.</p>

<p>Sed a consectetur sem. Sed vel gravida nibh, vitae ultricies sapien. Etiam pretium, erat volutpat tincidunt tempor, 
velit neque rutrum ex, ac blandit magna mi in dui. Sed venenatis sodales orci id dignissim. Nunc eget lacinia orci. 
Suspendisse ultrices interdum interdum. Quisque et pharetra dolor. Vivamus consequat, mauris in pellentesque fringilla, 
ligula lorem dapibus metus, aliquet dictum turpis purus vel lectus. Pellentesque tempus mattis dui nec aliquet. 
Curabitur ipsum eros, mollis vel nisi sit amet, auctor consectetur nulla. Nam commodo nunc interdum, bibendum sem ut, 
ultrices tortor. In a vestibulum ante. Pellentesque nec dapibus eros, laoreet congue magna.</p>
</div>
<div class="callouts row">
    <h4 class="title">
        Checkout some of our tools and resources below!
    </h4>
    <b-card-group class="offset-lg-3 col-lg-9">
        <b-card
            title="Phenotype Profile Search"
            class="col-lg-4"
          >
            <b-card-text>
              Target your search based off a list of phenotypes. 
            </b-card-text>
            <router-link to="/about/monarch-api">
                <b-button class="card-btn">Search <i class="fa fa-caret-right"></b-button>
            </router-link>
          </b-card>
          <b-card
              title="Monarch API"
              class="col-lg-4"
          >
              <b-card-text>
                Semantic integrated knowledge base at your fingertips. 
              </b-card-text>
              <router-link to="/about/monarch-api">
                <b-button class="card-btn">Learn More <i class="fa fa-caret-right"></b-button>
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
  },
};
</script>

<template>
  <div id="selenium_id_content">
    <div
      id="monarch-home-container"
      class="container-fluid monarch-container">

      <header class="intro">
        <div class="intro-body">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="brand-heading m-0 p-0">
                  <img
                    class="center-block text-center img-fluid"
                    style="max-height:80px;"
                    src="../assets/img/monarch-logo-white-stacked.png">
                </div>
              </div>
              <div
                class="col-md-12 py-2">
                <p class="intro-text">
                  Advancing translational science by semantically integrating
                  biological information across species.
                </p>
              </div>

              <div class="col-12">
                <monarch-autocomplete
                  :home-search="true"
                  :show-search-button="true"
                  :auto-focus="true"
                />
              </div>
            </div>

          </div>
        </div>
      </header>

      <section
        id="about"
        class="container content-section text-center">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <h2>The Monarch Initiative</h2>
            <p>Our philosophy is based on the premise that we want to make all the data count. We are driven to truly integrate biological information using semantics, and present it in a novel way, leveraging phenotypes to bridge the knowledge gap.</p>
          </div>
        </div>
      </section>

      <section
        id="features"
        class="features-section text-center">
        <div class="container-fluid">
          <div class="col-sm">
            <h2>What We Do</h2>
            <ul style="list-style-type:none;">
              <li>Integrate, align, and re-distribute cross-species gene, genotype, variant, disease, and phenotype data.</li>
              <li>Provide a portal for exploration of phenotype-based similarity.</li>
              <li>Facilitate identification of animal models of human disease through phenotypic similarity.</li>
              <li>Enable quantitative comparison of cross-species phenotypes.</li>
              <li>Develop embeddable widgets for data exploration.</li>
              <li>Influence genotype and phenotype reporting standards.</li>
              <li>Improve ontologies to better curate genotype-phenotype data.</li>
            </ul>

            <router-link
              to="/page/about"
              class="btn btn-dark">
              <span>Learn More</span>
            </router-link>

          </div>
        </div>
      </section>

      <section class="news-section">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm">
              <h5 class="text-center">
                News from <a
                  target="_blank"
                  href="https://medium.com/@MonarchInit">
                  @MonarchInit
                </a>
              </h5>
              <ul class="list-inline">
                <li
                  v-for="(item, index) in newsItems"
                  :key="index">
                  <small>{{ item.date }}</small>
                  <a
                    :href="item.url"
                    target="_blank">
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-sm">
              <h5 class="text-center">
                <i class="fa fa-twitter fa-fw"/>
                Tweets from
                <a
                  href="https://twitter.com/MonarchInit"
                  target="_blank">
                  @MonarchInit
                </a>
              </h5>
              <a
                class="twitter-timeline"
                href="https://twitter.com/TheDoctorBud/lists/monarchinitiative1?ref_src=twsrc%5Etfw"
                data-preview=""
                data-chrome="noheader nofooter"
                data-height="350">
                @MonarchInit
              </a>
            </div>

          </div>
        </div>
      </section>

      <section class="data-dashboard text-center">
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  style="max-height:35px;"
                  src="@/assets/img/icon-diseases.png"
                  alt="disease">
              </router-link>
              <span class="network-name"><br><b>218,313</b><br>Disease-Phenotype Associations</span>
            </div>
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  style="max-height:35px;"
                  src="@/assets/img/icon-genes.png"
                  alt="disease">
              </router-link>
              <span class="network-name"><br><b>793,526</b><br>Gene-Phenotype Associations</span>
            </div>
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  style="max-height:35px;"
                  src="@/assets/img/icon-models.png"
                  alt="disease">
              </router-link>
              <span class="network-name"><br><b>20,870</b><br>Model Associations</span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section text-center">
        <h4
          class="text-center"
          style="margin: 10px; padding: 0px 0px 25px 0px;">
          The Monarch Initiative is a collaboration between:
        </h4>
        <div class="container">
          <div class="row">
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="https://www.charite.de/en/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-charite.png"
                    alt="Charite">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="https://www.garvan.org.au/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-garvan.png"
                    alt="Garvan">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="https://www.jax.org/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-jackson.png"
                    alt="Jax">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="http://www.lbl.gov/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:25px;"
                    src="../assets/img/team-lbnl.jpeg"
                    alt="LBNL">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="https://www.ohsu.edu/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-ohsu.gif"
                    alt="OHSU">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="http://www.smd.qmul.ac.uk/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-qmul.png"
                    alt="QMUL">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="http://renci.org/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-renci.png"
                    alt="RENCI">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="media">
                <a
                  target="_blank"
                  href="http://www.sanger.ac.uk/"><span class="network-name"/>
                  <img
                    class="mr-3"
                    style="max-height:35px;"
                    src="../assets/img/team-sanger.png"
                    alt="Sanger">
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style="padding: 25px 15px 0px 15px;">
          Monarch is supported generously by a NIH Office of the Director Grant #5R24OD011883,
          as well as by NIH-UDP: HHSN268201350036C, HHSN268201400093P, NCI/Leidos #15X143.
          We are grateful to the many <a
            target="_blank"
            href="/about/sources">original sources of our data</a> for allowing Monarch to integrate them in this way.
            Except where forbidden by the original sources, this work is licensed under a
            Creative Commons Attribution 3.0 License.
        </div>
      </section>

      <footer class="footer">
        <home-footer/>
      </footer>

    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';
import HomeFooter from '@/components/HomeFooter.vue';
import getNewsItems from '@/api/News';

export default {
  name: 'Home',
  components: {
    'monarch-autocomplete': MonarchAutocomplete,
    'home-footer': HomeFooter
  },
  data() {
    return {
      newsItems: [],
    };
  },
  async mounted() {
    this.newsItems = await getNewsItems();

    /* eslint-disable */
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t.widgets.load();
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };
      return t;
    }(document, "script", "twitter-wjs"));
    /* eslint-enable */
  }
};

</script>

<style lang="scss">
  @import "~@/style/variables";
  $home-primary: pink;  // #42DCA3;

  #monarch-home-container h1,
  #monarch-home-container h2,
  #monarch-home-container h3,
  #monarch-home-container h4,
  #monarch-home-container h5,
  #monarch-home-container h6 {
    xmargin: 0 0 35px 0;
    xtext-transform: uppercase;
    xfont-family: "Montserrat","Helvetica Neue",Helvetica,Arial,sans-serif;
    xfont-weight: 700;
    xletter-spacing: 1px;
  }

  #monarch-home-container p {
    margin: 0 0 25px;
    font-size: 18px;
    line-height: 1.5;
    @media(min-width:$grid-float-breakpoint) {
      margin: 0 0 35px;
      font-size: 20px;
      line-height: 1.6;
    }
  }

  // #monarch-home-container a {
  //   color: $link-color;
  //   -webkit-transition: all .2s ease-in-out;
  //   -moz-transition: all .2s ease-in-out;
  //   transition: all .2s ease-in-out;
  //   &:hover,
  //   &:focus {
  //     xtext-decoration: none;
  //     color: darken($link-color,20%);
  //   }
  // }

  #monarch-home-container .light {
    font-weight: 400;
  }

  #monarch-home-container header.intro {
    display: table;
    width: 100%;
    height: auto;
    margin: $navbar-height - 1 0 0 0;
    padding: 20px 0;
    text-align: center;
    color: white;
    background-color: $monarch-bg-color;

    .intro-body {
      display: table-cell;
      vertical-align: middle;

      .brand-heading {
        padding: 20px 0 20px 0;
      }
      .intro-text {
        margin: 5px;
        font-size: 18px;
      }
    }

    @media(min-width:$grid-float-breakpoint) {
      .intro-body {
        .intro-text {
          font-size: 22px;
          line-height: 1.2em;
        }
      }

    }
  }

  #monarch-home-container .content-section {
    padding-top: 50px;
    padding-bottom: 50px;
    font-size: 18px;
  }

  #monarch-home-container .data-dashboard {
    padding-top: 50px;
    padding-bottom: 50px;
    font-size: 18px;
    background: #EBEBEB;
  }

  #monarch-home-container .news-section {
    padding-top: 30px;
    padding-bottom: 30px;
    font-size: 18px;
  }

  #monarch-home-container ul {
    max-height: 350px;
    overflow-y: auto;
  }

  #monarch-home-container ul li {
    line-height: 1.5rem;
  }

  #monarch-home-container .search-section {
    padding: 50px 10px;
  }

  #monarch-home-container .features-section {
    height: auto;
    width: 100%;
    padding: 50px 0;
    color: black;
    font-size: 18px;
    background-color: #E8E8E8;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
    -o-background-size: cover;
  }

  #monarch-home-container .partners-section {
    padding: 50px 10px;
  }

  #monarch-home-container .btn.btn-dark {
    text-transform: uppercase;
    color: white;
    font-family: "Montserrat","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-weight: 400;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }

  #monarch-home-container footer.footer {
    display: table;
    width: 100%;
    height: auto;
    padding: 50px 0 0 0;
    text-align: center;
    color: white;
    background-color: $monarch-bg-color;

    a {
      color: white;
    }
  }
</style>

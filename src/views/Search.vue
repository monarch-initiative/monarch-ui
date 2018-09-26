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
        <div
          v-cloak
          id="vue-app"
          class="wrapperforfooter">
          <div class="container-fluid monarch-container">
            <div class="content">
              <div id="complete-info">
                <div
                  v-if="!searching"
                  class="row">
                  <div class="col-xs-12">
                    <h2><span class="searchTerm">{{ term }}</span> has <span id="totalCount">{[{numFound}]}</span>
                      matches</h2>
                  </div>
                </div>

                <div
                  v-if="numFound != 0"
                  class="row">
                  <div class="col-xs-12 col-md-3">
                    <div class="filters">
                      <div
                        v-for="facet in facets"
                        class="search-results-ui-group">
                        <h3>{[{beautifyFacetTitle(Object.keys(facet)[0])}]}</h3>
                        <ul class="search-results-button-group">
                          <li
                            :class="{'is-checked': user_facets[Object.keys(facet)[0]] == undefined}"
                            class="search-results-button"
                            @click="updateFacets($event, Object.keys(facet)[0], 'all')">
                            Select all
                          </li>
                          <li
                            v-for="filter in facet[Object.keys(facet)[0]]"
                            :class="{'is-checked': user_facets[Object.keys(facet)[0]] == filter[0]}"
                            class="search-results-button"
                            @click="updateFacets($event, Object.keys(facet)[0], filter[0])">
                            {[{filter[0]}]} ({[{filter[1]}]})
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                  <div class="col-xs-12 col-md-9">
                    <div class="search-results-rows">
                      <table
                        :id="'selenium_id_' + selenium_id"
                        class="search-results-table table table-striped table-sm simpletable">
                        <thead>
                          <tr>
                            <th width="25%">Term</th>
                            <th width="15%">Category</th>
                            <th width="25%">Taxon</th>
                            <th>Matching String</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(result, index) in results"
                            class="search-result-item">
                            <td
                              v-if="result.linkURL">
                              <a
                                :href="result.linkURL"
                                data-monarch-legacy
                                v-html="result.linkName"/>
                            </td>
                            <td
                              v-else
                              v-html="result.linkName"/>
                            <td>{[{result.categoryCommas}]}</td>
                            <td>{[{result.taxonLabel}]}</td>
                            <td v-html="result.htmlHighlight"/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div
                  v-if="!searching && numRowsDisplayed < numFound"
                  class="row">
                  <button
                    type="button"
                    class="btn btn-primary btn-block btn-sm"
                    @click="fetchMore()">Load more
                  </button>
                </div>

                <div
                  v-if="searching"
                  class="row">
                  <br>
                  <div class="col-xs-12">
                    <div class="progress">
                      <div
                        class="progress-bar progress-bar-striped active"
                        role="progressbar"
                        aria-valuenow="40"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="width:100%">Searching…
                      </div>
                    </div>
                  </div>
                </div>


                <div v-if="!searching && numFound == 0">
                  <h4>No results found.</h4>
                  <div v-if="suggestions.length != 0">
                    Did you mean: <br>
                    <span v-for="suggestion in suggestions">
                      <a
                        :href="'/search/' + suggestion[1]"
                        data-monarch-legacy> {[{suggestion[0]}]} </a><br>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- closes wrapperforfooter -->
      </section>


      <footer class="footer">
        <home-footer/>
      </footer>

    </div>
  </div>
</template>


<script>
import HomeFooter from '@/components/HomeFooter.vue';
import axios from 'axios';

const validCats = {
  'gene': 'gene',
  'phenotype': 'phenotype',
  'genotype': 'genotype',
  'disease': 'disease',
  'variant locus': 'variant',
};

export default {
  name: 'Search',
  components: {
    'home-footer': HomeFooter
  },
  data() {
    return {
      facets: [],
      user_facets: {},
      results: [],
      highlight: {},
      suggestions: {},
      page: 0,
      numFound: 0,
      numRowsDisplayed: 0,
      selenium_id: '',
      searching: true
    };
  },
  mounted() {
  },
  methods: {
    sanitizeHighlighting(htmlHighlightedText) {
      // NYI: We should properly make sure that the highlighting conforms to our
      // expectations, and does not contain script tags or other nasties.
      return htmlHighlightedText;
    },
    getOrderedCats(catList) {
      catList = catList || [];
      const categoryObj = catList.reduce((map, cat) => {
        const mappedCat = validCats[cat];
        if (mappedCat) {
          map.valid[mappedCat] = mappedCat;
        }
        else {
          map.other[cat] = cat;
        }
        return map;
      },
      {
        valid: {},
        other: {}
      });

      if (categoryObj.valid.length > 1) {
        console.log('goc', catList, categoryObj.valid);
      }
      return categoryObj;
    },
    sanitize(rawResults) {
      return rawResults.map((result) => {
        const orderedCats = this.getOrderedCats(result.category_std);
        const orderedCatsCombined = Object.keys(orderedCats.valid); // [].concat(Object.keys(orderedCats.valid), Object.keys(orderedCats.other));
        const category = Object.keys(orderedCats.valid)[0];
        const categoryLower = category ? category.toLowerCase() : '';
        const categoryCommas = orderedCatsCombined.join(',');
        const taxonLabel = typeof result.taxon_label === 'object'
          ? result.taxon_label.join(',')
          : result.taxon_label;
        const htmlHighlight = this.highlight[result.id];

        result.linkName = this.sanitizeHighlighting(result.label[0]);
        if (category) {
          result.linkURL = '/' + category + '/' + result.id;
        }
        result.category = categoryLower;
        result.categoryCommas = categoryCommas;
        result.taxonLabel = taxonLabel;
        result.htmlHighlight = htmlHighlight;

        return result;
      });
    },
    fetchResults() {
      // console.log("=== FETCH " + this.page + " " + JSON.stringify(this.user_facets));
      const anchor = this;
      anchor.searching = true;
      axios.get(
        `/searchapi/${searchTerm}`,
        {
          params: this.user_facets
        }
      )
        .then(function (response) {
          // console.log('response', response);
          anchor.searching = false;
          anchor.numFound = response.data.response.numFound;
          anchor.numRowsDisplayed = response.data.response.docs.length;
          anchor.highlight = {};
          anchor.selenium_id = 'loaded';
          if (anchor.numFound === 0) {
            anchor.fetchSuggestions();
          }
          // Take the first highilited field and massage it in a more convenient data structure
          Object.keys(response.data.highlighting)
            .forEach(function (key) {
              const firstKey = Object.keys(response.data.highlighting[key])[0];
              anchor.highlight[key] = response.data.highlighting[key][firstKey][0];
            });

          anchor.results = anchor.sanitize(response.data.response.docs);

          // TODO: fix on the biolink end?
          const facets_fields = response.data.facet_counts.facet_fields;
          if (anchor.facets.length === 0) { // for initial visit of the search page
            Object.keys(facets_fields)
              .forEach(function (key) {
                const json = {};
                json[key] = facets_fields[key];
                anchor.facets.push(json);
              });
          }
          else { // user used facets, just update the numbers
            anchor.facets.forEach(function (facet) {
              const key = Object.keys(facet)[0];
              const filters = facet[key];

              // make an inventory of newly fetched facets
              const newFacets = {};
              facets_fields[key].forEach(function (facets_field) {
                newFacets[facets_field[0]] = facets_field[1];
              });

              // Update the existing filters, with new number if exists, or 0
              filters.forEach(function (filter) {
                if (newFacets.hasOwnProperty(filter[0])) {
                  filter[1] = newFacets[filter[0]];
                }
                else {
                  filter[1] = 0;
                }
              });

            });
          }

          if (window.vueRouter) {
            anchor.$nextTick(function () {
              window.vueRouter.updatePageLinks();
            });
          }
        })
        .catch(function (error) {
          anchor.searching = false;
          console.log(error);
        });
    },
    fetchMore() {
      this.page += 1;
      const anchor = this;
      anchor.searching = true;
      // const params = jQuery.extend(true, {}, this.user_facetst); // deep copy
      // params.p = this.page;
      // axios.get('/searchapi/' + searchTerm, { params })
      //   .then(function (response) {
      //     anchor.searching = false;
      //     anchor.numRowsDisplayed += response.data.response.docs.length;
      //     Object.keys(response.data.highlighting)
      //       .forEach(function (key) {
      //         const firstKey = Object.keys(response.data.highlighting[key])[0];
      //         anchor.highlight[key] = response.data.highlighting[key][firstKey][0];
      //       });
      //
      //     anchor.results = anchor.results.concat(
      //       anchor.sanitize(response.data.response.docs)
      //     );
      //   })
      //   .catch(function (error) {
      //     anchor.searching = false;
      //     console.log(error);
      //   });
    },
    updateFacets(event, category, item) {
      if (item === 'all') {
        delete this.user_facets[category];
      }
      else {
        this.user_facets[category] = item;
      }
      this.page = 0;
      this.fetchResults();
    },
    beautifyFacetTitle(title) {
      // taxon_label => Taxon
      // category => Category
      const cleanTitle = title.split('_')[0];
      return cleanTitle.charAt(0)
        .toUpperCase() + cleanTitle.slice(1);
    },
    fetchSuggestions() {
      // console.log("=== FETCH SUGGESTIONS");
      const anchor = this;
      anchor.searching = true;
      axios.get('/suggestapi/' + searchTerm)
        .then(function (response) {
          anchor.suggestions = response.data;
          anchor.searching = false;
        })
        .catch(function (error) {
          console.log(error);
          anchor.searching = false;
        });
    }
  },
};

</script>


<style lang="scss">
    @import "~@/style/variables";

    .search-results-count {
        margin-left: 5px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .search-results-ui-group {
        display: inline-block;
        margin-left: 5px;
        margin-bottom: 10px;
    }

    .search-results-ui-group h3 {
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
    }

    .search-results-ui-group {
        width: 100%;
    }

    .search-results-button-group {
        border: 1px solid #ddd;
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    .search-results-button {
        padding: 3px 10px;
        background: #fafafa;
        border: 1px solid #fff;
        color: #222;
        text-align: left;
        cursor: pointer;
    }

    .search-results-button:before {
        content: "- ";
        color: #337ab7;
        font-weight: bold;
    }

    .search-results-button:hover {
        background-color: #5cb85c;
        border: 1px solid #fff;
    }

    .search-results-button.is-checked {
        color: #fff;
        background: #337ab7;
        border: 1px solid #fff;
    }

    .search-results-button.is-checked:before {
        content: "\2713 ";
        color: #5cb85c;
        font-weight: bold;
    }

    .search-results-table {
    }

    /* clear fix */
    .search-results-table:after {
        content: '';
        display: block;
        clear: both;
    }

    /* search-result-item */

    .search-result-item {
        width: 100%;
    }

    /* overwrite the default CSS */
    .search-result-item .hilite {
        font-weight: bold;
    }

    #more {
        margin: 10px 0 20px;
        width: 200px;
    }

    #more-spinner {
        display: none;
        width: 45px;
        margin-top: 15px;
    }

    #totalCount {
        color: #d9534f;
    }

    .searchTerm {
        color: #d9534f;
    }
</style>

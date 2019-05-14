<template>
  <div id="selenium_id_content">
    <div
      id="monarch-search-container"
      class="container-fluid monarch-container">
      <header class="intro">
        <div class="intro-body">
          <div class="container">
            <div class="row">
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

      <div class="row">
        <div
          class="container col-md-3"
        >
          <div
            v-if="categoryFilters.length > 0 || taxonFilters.length > 0"
            class="b-row card" >
            <div class="card-header">
              Filters
            </div>

            <div v-if="categoryFilters.length>0">
              <div class="offset-1 font-weight-bold">Categories</div>
              <ul>
                <li
                  v-for="category in categoryFilters"
                  :key="category"
                  href="javascript:;"
                  class="b-row">
                  {{ category }}
                  <button
                    class="fa fa-remove"
                    @click="removeCategoryFilter(category)"/>
                </li>
              </ul>
            </div>
            <div v-if="taxonFilters.length > 0">
              <div class="offset-1 font-weight-bold">Taxa</div>
              <ul>
                <li
                  v-for="taxon in taxonFilters"
                  :key="taxon"
                  href="javascript:;"
                  class="b-row">
                  {{ taxon }}
                  <button
                    class="fa fa-remove"
                    @click="removeTaxonFilter(taxon)"/>
                </li>
              </ul>
            </div>

          </div>
          <div
            class="b-row card"
            style="margin-top: 20px">
            <div class="card-header">
              Categories
            </div>
            <div class="card-body">
              <ul class="showFacetLinks col-md-12">
                <li
                  v-for="(value,propertyName) of facetCategories"
                  :key="propertyName"
                >
                  <a
                    href="javascript:"
                    @click="addCategoryFilter(propertyName)">
                    {{ propertyName }}
                    <div class="pull-right">
                      {{ value }}
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="b-row card"
            style="margin-top: 20px">
            <div class="card-header">
              Taxa
            </div>
            <div class="card-body">
              <ul class="showFacetLinks  col-md-12">
                <li
                  v-for="(value,propertyName) of facetTaxons"
                  :key="propertyName"
                >
                  <a
                    href="javascript:"
                    @click="addTaxonFilter(propertyName)">
                    {{ propertyName }}
                    <div class="pull-right">
                      {{ value }}
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <b-pagination
            :total-rows="numFound"
            :per-page="rowsPerPage"
            v-model="currentPage"
            responsive="true"
            class="table-sm table-border-soft mt-2"
            size="md"
          />
          <div class="search-results-rows">

            <div v-if="searchResults && searchResults.length > 0 ">
              <h3><span class="searchTerm">{{ query }}</span> has <span
                class="searchTerm">{{ numFound }}</span> matches</h3>
              <b-table
                ref="results-table"
                :fields="fields"
                :items="rowsProvider"
                :current-page="currentPage"
                :per-page="rowsPerPage"
                striped
                responsive="true"
                class="table-sm table-border-soft test-search-results-table"
                hover>
                <template
                  slot="label"
                  slot-scope="row"
                >
                  <router-link :to="row.item.toLink">
                    {{ row.item.label }}
                  </router-link>
                </template>
                <template
                  slot="highlight"
                  slot-scope="row"
                >
                  <span v-html="row.item.highlight"/>
                </template>
              </b-table>
            </div>
          </div>
        </div>

        <monarch-footer/>
      </div>
    </div>
  </div>
</template>


<script>
import * as BL from '@/api/BioLink';

const DEFAULT_ROWS_PER_PAGE = 25;
const validCats = {
  'gene': 'gene',
  'phenotype': 'phenotype',
  'genotype': 'genotype',
  'disease': 'disease',
  'variant': 'variant',
};

export default {
  name: 'Search',
  components: {
    'monarch-footer': require('@/components/Footer.md').default,
  },
  data() {
    return {
      facets: [],
      user_facets: {},
      results: [],
      highlight: {},
      searchResults: [],
      currentPage: 1,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      categoryFilters: [],
      taxonFilters: [],
      facetCategories: [],
      facetTaxons: [],
      numFound: 0,
      numRowsDisplayed: 0,
      selenium_id: '',
      searching: true,
      fields: [
        {
          key: 'label',
          label: 'Term'
        },
        {
          key: 'category',
          label: 'Category'
        },
        {
          key: 'taxon',
          label: 'Taxon'
        },
        {
          key: 'highlight',
          label: 'Matching String'
        },
      ]
    };
  },
  watch: {
    '$route': function $route(to, from) {
      this.searchViaRouteParams();
      this.$refs['results-table'].refresh();
    }
  },
  mounted() {
    this.searchViaRouteParams();
  },

  methods: {
    addTaxonFilter(taxon) {
      this.taxonFilters.push(taxon);
      this.search();
      this.$refs['results-table'].refresh();
    },
    removeTaxonFilter(taxon) {
      this.taxonFilters = this.taxonFilters.filter(c => c !== taxon);
      this.search();
      this.$refs['results-table'].refresh();
    },
    addCategoryFilter(category) {
      this.categoryFilters.push(category);
      this.search();
      this.$refs['results-table'].refresh();
    },
    removeCategoryFilter(category) {
      this.categoryFilters = this.categoryFilters.filter(c => c !== category);
      this.search();
      this.$refs['results-table'].refresh();
    },
    searchViaRouteParams() {
      this.query = this.$route.params.query;
      // const start = this.$route.params.start ? this.$route.params.start : 0;
      this.rowsPerPage = this.$route.params.rows ? this.$route.params.rows : DEFAULT_ROWS_PER_PAGE;
      this.search();
    },
    rowsProvider(ctx, callback) {
      // const start = ((this.currentPage - 1) * this.rowsPerPage);
      this.search()
        .then((data) => {
          callback(this.searchResults);
        })
        .catch((error) => {
          callback([]);
        });
    },
    async search() {
      try {
        // let start = page
        const start = ((this.currentPage - 1) * this.rowsPerPage);
        // this.query, start, this.rowsPerPage
        const searchResponse = await BL.getSearchResults(this.query, start, this.rowsPerPage, this.categoryFilters, this.taxonFilters);
        this.searchResults.length = 0;
        // this.searchParams = {};
        this.facetCategories = searchResponse.facet_counts.category;
        this.facetTaxons = searchResponse.facet_counts.taxon_label;
        this.numFound = searchResponse.numFound;
        // console.log('searchResponse', searchResponse.numFound, searchResponse.docs[0].label[0]);
        searchResponse.docs.forEach((elem, index) => {
          const highlight = searchResponse.highlighting[elem.id];
          const resultPacket = {
            category: elem.category[0],
            taxon: elem.taxon_label,
            label: elem.label[0],
            curie: elem.id,
            rows: this.rows,
            highlight: highlight.highlight,
            toLink: '/' + elem.category[0] + '/' + elem.id,
            match: highlight.match,
            hasHighlight: highlight.has_highlight,
          };
          this.searchResults.push(resultPacket);
        });
      }
      catch (e) {
        console.log('Search ERROR', e, this);
      }
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

    .hilite {
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

    .showFacetLinks {
        list-style: none;
    }
</style>

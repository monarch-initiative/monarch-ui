<template>
  <div id="selenium_id_content">
    <div
      id="monarch-home-container"
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

      <div class="col-xs-12 col-md-9">
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
            <h3><span class="searchTerm">{{ query }}</span>  has <span class="searchTerm">{{ numFound }}</span> matches</h3>
            <b-table
              :fields="fields"
              :items="rowsProvider"
              :current-page="currentPage"
              :per-page="rowsPerPage"
              striped
              responsive="true"
              class="table-sm table-border-soft"
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

        <monarch-footer/>
      </div>
    </div>
</div></template>


<script>
import * as BL from '@/api/BioLink';

const DEFAULT_ROWS_PER_PAGE = 25;
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
    'monarch-footer': require('@/components/Footer.md').default,
  },
  data() {
    return {
      facets: [],
      user_facets: {},
      results: [],
      highlight: {},
      searchResults: {},
      currentPage: 1,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      numFound: 0,
      numRowsDisplayed: 0,
      selenium_id: '',
      searching: true,
      fields: [
        { key: 'label', label: 'Term' },
        { key: 'category', label: 'Category' },
        { key: 'taxon', label: 'Taxon' },
        { key: 'highlight', label: 'Matching String' },
      ]
    };
  },
  mounted() {
    this.query = this.$route.params.query;
    // const start = this.$route.params.start ? this.$route.params.start : 0;
    this.rowsPerPage = this.$route.params.rows ? this.$route.params.rows : DEFAULT_ROWS_PER_PAGE;
    this.search();
  },
  methods: {
    rowsProvider(ctx, callback) {
      // const start = ((this.currentPage - 1) * this.rowsPerPage);
      this.search().then((data) => {
        callback(this.searchResults);
      }).catch((error) => {
        callback([]);
      });
    },
    async search() {
      try {
        // let start = page
        const start = ((this.currentPage - 1) * this.rowsPerPage);
        // this.query, start, this.rowsPerPage
        const searchResponse = await BL.getSearchResults(this.query, start, this.rowsPerPage);
        this.searchResults = [];
        this.searchParams = {};
        this.searchFacets = {};
        this.numFound = searchResponse.numFound;
        // console.log('HLS', searchResponse.highlighting);
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
</style>

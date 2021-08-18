<template>
  <div id="monarch-search-container" class="container-fluid monarch-view">
    <div class="row">
      <div class="container col-md-3">
        <div
          v-if="categoryFilters.length > 0 || taxonFilters.length > 0"
          class="row card"
        >
          <div class="card-header py-2">Filters</div>

          <div v-if="categoryFilters.length > 0" class="px-2">
            <div class="font-weight-bold">Categories</div>
            <ul>
              <li
                v-for="category in categoryFilters"
                :key="category"
                href
                class="row"
              >
                {{ biolinkCategory(category) }}
                &nbsp;
                <button
                  class="fa fa-remove"
                  @click="removeCategoryFilter(category)"
                />
              </li>
            </ul>
          </div>

          <div v-if="taxonFilters.length > 0" class="px-2">
            <div class="font-weight-bold">Taxa</div>
            <ul>
              <li v-for="taxon in taxonFilters" :key="taxon" href class="row">
                {{ taxon }}
                &nbsp;
                <button
                  class="fa fa-remove"
                  @click="removeTaxonFilter(taxon)"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="row card" style="margin-top: 20px">
          <div class="card-header py-1">Categories</div>
          <div class="card-body py-1">
            <ul class="showFacetLinks col-md-12">
              <li
                v-for="(value, category) of facetCategories"
                :key="category"
                class="border-bottom"
              >
                <a href @click.prevent="addCategoryFilter(category)">
                  {{ biolinkCategory(category) }}
                  &nbsp;
                  <div class="pull-right">
                    {{ value }}
                  </div>
                  <div class="clearfix" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="row card" style="margin-top: 20px">
          <div class="card-header py-1">Taxa</div>
          <div class="card-body py-1">
            <ul class="showFacetLinks col-md-12">
              <li
                v-for="(value, taxon) of facetTaxons"
                :key="taxon"
                class="border-bottom"
              >
                <a href @click.prevent="addTaxonFilter(taxon)">
                  {{ taxon }}
                  &nbsp;
                  <div class="pull-right">
                    {{ value }}
                  </div>
                  <div class="clearfix" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="search-results-rows">
          <div v-if="searchResults && searchResults.length > 0">
            <div class="row">
              <div class="col-xs-8 qry-title">
                <h3>
                  <span class="searchTerm">"{{ query }}"</span> has
                  <span class="searchTerm">{{ numFound }}</span> matches
                </h3>
              </div>
              <div class="col-xs-4">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="numFound"
                  :per-page="rowsPerPage"
                  responsive="true"
                  class="table-sm table-border-soft mt-2"
                  size="md"
                />
              </div>
            </div>
            <div class="results">
              <b-table
                ref="results-table"
                :fields="fields"
                :items="rowsProvider"
                :current-page="currentPage"
                :per-page="rowsPerPage"
                responsive="true"
                class="table-sm table-border-soft search-results-table"
                hover
              >
                <template v-slot:cell(label)="row">
                  <router-link :to="row.item.toLink">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="row.item.label" />
                  </router-link>
                </template>
                <template v-slot:cell(highlight)="row">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="row.item.highlight" />
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as BL from "@/api/BioLink";
import { reduceCategoryList } from "@/lib/category-map";
import { sanitizeNodeLabel } from "@/lib/utils";

const DEFAULT_ROWS_PER_PAGE = 25;

export default {
  name: "Search",
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
      facetCategories: {},
      facetTaxons: {},
      numFound: 0,
      numRowsDisplayed: 0,
      selenium_id: "",
      searching: true,
      fields: [
        {
          key: "label",
          label: "Term",
        },
        {
          key: "category",
          label: "Category",
        },
        {
          key: "taxon",
          label: "Taxon",
        },
        {
          key: "highlight",
          label: "Matching String",
        },
      ],
    };
  },
  watch: {
    $route: function $route(to, from) {
      this.searchViaRouteParams();
      this.updateResultsTable();
    },
  },
  mounted() {
    this.searchViaRouteParams();
  },

  methods: {
    updateResultsTable() {
      if (this.$refs["results-table"]) {
        this.$refs["results-table"].refresh();
      }
    },
    biolinkCategory(category) {
      return reduceCategoryList([category]);
    },
    addTaxonFilter(taxon) {
      this.taxonFilters.push(taxon);
      this.search();
      this.updateResultsTable();
    },
    removeTaxonFilter(taxon) {
      this.taxonFilters = this.taxonFilters.filter((c) => c !== taxon);
      this.search();
      this.updateResultsTable();
    },
    addCategoryFilter(category) {
      this.categoryFilters.push(category);
      this.search();
      this.updateResultsTable();
    },
    removeCategoryFilter(category) {
      this.categoryFilters = this.categoryFilters.filter((c) => c !== category);
      this.search();
      this.updateResultsTable();
    },
    searchViaRouteParams() {
      this.query = this.$route.params.query;
      // const start = this.$route.params.start ? this.$route.params.start : 0;
      this.rowsPerPage = this.$route.params.rows
        ? this.$route.params.rows
        : DEFAULT_ROWS_PER_PAGE;
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
        const start = (this.currentPage - 1) * this.rowsPerPage;
        // this.query, start, this.rowsPerPage
        const searchResponse = await BL.getSearchResults(
          this.query,
          start,
          this.rowsPerPage,
          this.categoryFilters,
          this.taxonFilters
        );
        this.searchResults.length = 0;
        // this.searchParams = {};
        this.facetCategories = {};
        // console.log(JSON.stringify(searchResponse.facet_counts.category, null, 2));
        Object.keys(searchResponse.facet_counts.category).forEach((key) => {
          if (this.categoryFilters.indexOf(key) === -1) {
            this.facetCategories[key] =
              searchResponse.facet_counts.category[key];
          }
        });

        this.facetTaxons = searchResponse.facet_counts.taxon_label;
        this.numFound = searchResponse.numFound;
        // console.log('searchResponse', searchResponse.numFound, searchResponse.docs[0].label[0]);
        searchResponse.docs.forEach((elem, index) => {
          const highlight = searchResponse.highlighting[elem.id];
          const simplifiedCategory = reduceCategoryList(elem.category);
          const resultPacket = {
            category: simplifiedCategory,
            taxon: elem.taxon_label,
            label: sanitizeNodeLabel(elem.label[0]),
            curie: elem.id,
            rows: this.rows,
            highlight: highlight.highlight,
            toLink: "/" + simplifiedCategory + "/" + elem.id,
            match: highlight.match,
            hasHighlight: highlight.has_highlight,
          };
          this.searchResults.push(resultPacket);
        });
      } catch (e) {
        // console.log('Search ERROR', e, this);
      }
    },
  },
};
</script>

<style lang="scss">
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

.row.card {
  padding-right: 0px;
  padding-left: 0px;
}

.card-body.py-1 {
  padding-top: 0px;
  padding-right: 0px;
  padding-left: 0px;
}

.qry-title {
  padding: 10px 20px 10px 0px;
}

.results {
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.search-results-table {
  background-color: #fff;
  border-top-style: none;
}

.search-results-table th {
  border-top-style: none;
  background-color: #f7f7f7;
}

/* clear fix */
.search-results-table:after {
  content: "";
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

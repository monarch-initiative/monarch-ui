<template>
  <div
    :class="{
      'home-search': homeSearch,
      'open': open
    }"
    class="monarch-autocomplete autocomplete autorootdiv"
  >
    <div
      :class="{
        'input-group-sm': !homeSearch
      }"
      class="input-group"
    >
      <div
        class="input-group-prepend"
      >
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          @click="toggleFilterBox"
        >
          {{ selectDisplay }}
        </button>
        <div
          v-if="catDropDown"
          v-click-outside="closeFilterBox"
          class="dropdown-menu list-group dropCatList px-4"
        >
          <div class="form-group">
            <b-form-radio-group
              v-model="category"
              :options="options"
              stacked
            />
          </div>
        </div>
      </div>
      <input
        v-model="value"
        v-click-outside="toggleSuggestions"
        :placeholder="dynamicPlaceholder"
        :class="{
          'loading': loading
        }"
        class="form-control xform-control-sm test-input-search-text"
        type="text"
        @input="debounceInput"
        @keydown="inputChanged"
        @keydown.enter="enter"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.esc="clearSearch"
        @focus="toggleSuggestions"
      >

      <div
        v-if="showSearchButton"
        class="input-group-append"
      >
        <button
          v-b-tooltip.topright
          class="btn xbtn-sm btn-light py-0 test-button-show-all"
          type="button"
          title="Show all matching results"
          @click="showMore"
        >
          <i class="p-0 m-0 fa xfa-2x fa-search-plus fa-solid" />
        </button>
      </div>
      <div
        v-if="open"
        :class="{
          'full-width-search': fullWidthSearch
        }"
        class="dropdown-menu list-group dropList mx-2 test-input-dropdown"
      >
        <!--
          @blur above hides @click. Use @mousedown instead
          https://stackoverflow.com/a/50313781/5667222
        -->
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{'active': isActive(index)}"
          class="border-bottom m-0 px-1 test-input-dropdown-option"
          @mousedown="suggestionClick(index)"
          @mouseover="mouseOver(index)"
        >
          <div
            class="row m-0 p-0"
          >
            <div
              v-if="suggestion.has_hl"
              class="col-5"
            >
              <span v-html="$sanitizeText(suggestion.highlight)" />
            </div>
            <div
              v-else
              class="col-5"
            >
              <strong>{{ suggestion.match }}</strong>
            </div>
            <div
              class="col-4"
            >
              <i>{{ suggestion.taxon }}</i>
            </div>
            <div
              class="col-3 text-align-right"
            >
              <small>{{ suggestion.category }}</small>
            </div>
          </div>
        </div>
        <div class="row mx-3">
          <div
            v-if="suggestions.length === 0"
            class="col border"
          >
            <b>No results for '{{ value }}'</b>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="homeSearch"
      class="examples"
    >
      e.g.
      <button
        v-for="(example, index) in exampleSearches"
        :key="index"
        class="btn btn-outline-light m-1 py-0 example-button"
        role="button"
        @click="useExample(example.searchString, example.category)"
      >
        {{ example.searchString }}
      </button>
    </div>
  </div>
</template>

<script>

import vClickOutside from 'v-click-outside';
import * as biolink from '@/api/BioLink';
import { reduceCategoryList } from '@/lib/CategoryMap';

const debounce = require('lodash/debounce');

const exampleSearches = [
  {
    searchString: 'Marfan Syndrome'
  },
  {
    searchString: 'Multicystic kidney dysplasia',
    category: 'phenotype'
  },
  {
    searchString: 'SHH',
    category: 'gene'
  }
];

export default {
  name: 'AutoComplete',
  filters: {
    allLower(word) {
      return word.toLowerCase();
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    showSearchButton: {
      type: Boolean,
      required: false,
      default: false
    },
    autoFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    homeSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    fullWidthSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    definedCategories: {
      type: Array,
      required: false,
      default: null,
    },
    allowedPrefixes: {
      type: Array,
      required: false,
      default: null,
    },
    searchFilters: {
      type: Array,
      required: false,
      default: null,
    },
    dynamicPlaceholder: {
      type: String,
      required: false,
      default: 'Explore Monarch for phenotypes, diseases, genes and more..'
    }
  },
  data() {
    return {
      destroying: false,
      category: 'all',
      selectDisplay: 'All',
      exampleSearches,
      options: [],
      catDropDown: false,
      value: '',
      suggestions: [],
      open: false,
      current: -1,
      loading: false
    };
  },
  watch: {
    value() {
      if (!this.value) {
        this.clearSearch();
      }
    },
    category(newValue) {
      this.selectDisplay = this.options.find(opts => opts.value === newValue).text;
      this.closeFilterBox();
      if (!this.definedCategories) {
        this.suggestions = [];
      }
      if (this.value.length > 0) {
        this.fetchData();
      }
    },
    definedCategories() {
      this.configureOptions();
    }
  },
  mounted() {
    this.configureOptions();
  },
  beforeDestroy() {
    this.destroying = true;
  },
  methods: {
    debounceInput: debounce(
      function debounceInput() {
        if (!this.destroying) {
          if (this.value && this.value.length >= 3) {
            this.fetchData();
          }
        }
      }, 500, { leading: false, trailing: true }
    ),
    async fetchData() {
      try {
        let searchResponse;
        if (this.category === 'all-subset') {
          searchResponse = await biolink.getSearchTermSuggestions(
            this.value, this.definedCategories, this.allowedPrefixes, this.searchFilters
          );
        } else {
          searchResponse = await biolink.getSearchTermSuggestions(
            this.value, this.category, this.allowedPrefixes, this.searchFilters
          );
        }
        this.suggestions = [];
        this.current = -1;
        searchResponse.docs.forEach((elem) => {
          const resultPacket = {
            match: elem.match,
            category: reduceCategoryList(elem.category),
            taxon: this.checkTaxon(elem.taxon_label),
            curie: elem.id,
            highlight: elem.highlight,
            has_hl: elem.has_highlight
          };
          this.suggestions.push(resultPacket);
        });

        this.open = true;
        this.loading = false;
      } catch (e) {
        console.log('nodeResponse ERROR', e, this);
      }
    },
    configureOptions() {
      this.options = [];
      if (this.definedCategories) {
        if (this.definedCategories.length > 1) {
          this.options.push({ text: 'All', value: 'all-subset' });
        }
        this.definedCategories.forEach((elem) => {
          this.options.push({
            text: this.firstCap(elem),
            value: elem,
          });
        });
        if (this.definedCategories.length === 1) {
          this.category = this.options[0].value;
        } else {
          this.category = 'all-subset';
        }
      } else {
        this.options = [
          {
            text: 'All',
            value: 'all'
          },
          {
            text: 'Gene',
            value: 'gene',
          },
          {
            text: 'Genotype',
            value: 'genotype',
          },
          {
            text: 'Variant',
            value: 'variant',
          },
          {
            text: 'Phenotype',
            value: 'phenotype',
          },
          {
            text: 'Disease',
            value: 'disease',
          }
        ];
      }
    },
    enter() {
      const currentData = this.suggestions[this.current];
      if (currentData) {
        if (!this.definedCategories) {
          this.$router.push({ path: `/${currentData.category}/${currentData.curie}` });
        } else {
          this.$emit('interface', currentData);
        }
      } else {
        this.showMore();
      }
      this.value = '';
      this.open = false;
      this.suggestions = [];
    },
    up() {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    toggleSuggestions(event) {
      if (this.open) {
        this.open = false;
      } else if (this.suggestions.length > 0 && event.target.nodeName === 'INPUT') {
        this.open = true;
      }
    },
    closeFilterBox() {
      this.catDropDown = false;
    },
    toggleFilterBox() {
      this.catDropDown = !this.catDropDown;
    },
    inputChanged() {
      this.catDropDown = false;
    },
    down() {
      if (this.current < this.suggestions.length - 1) {
        this.current += 1;
      }
    },
    isActive(index) {
      return index === this.current;
    },
    mouseOver(index) {
      this.current = index;
    },
    suggestionClick(index) {
      const currentData = this.suggestions[index];
      if (!this.definedCategories) {
        this.$router.push({ path: `/${currentData.category}/${currentData.curie}` });
      } else {
        this.$emit('interface', this.suggestions[index]);
      }
      this.value = '';
      this.open = false;
      this.suggestions = [];
    },
    showMore() {
      // window.location = `/search/${this.value}`;
      this.$router.push({ path: `/search/${this.value}` });
    },
    clearSearch() {
      this.suggestions = [];
      this.open = false;
    },
    firstCap(elem) {
      return elem.charAt(0).toUpperCase() + elem.substr(1);
    },
    checkTaxon(taxon) {
      if (typeof taxon === 'string') {
        return taxon;
      }
      return null;
    },
    useExample(searchString, category) {
      this.value = searchString;
      if (category) {
        this.category = category;
      } else {
        this.fetchData();
      }
    }
  },
};
</script>

<style lang="scss">
@import "~@/style/variables";

.monarch-autocomplete {

  .text-align-right {
    text-align: right;
  }

  .autocomplete-input {
    position: relative;
    height: 300px;
  }

  .loading {
    background-color: #ffffff;
    background-image: url("../assets/img/infinity.gif");
    background-size: 25px 25px;
    background-position: 99%;
    background-repeat: no-repeat;
  }

  .dropList {
    width: 100%;
    border-radius: 2px;
    border: solid black 1px;
    overflow-y: auto;
    cursor: pointer;

    &.full-width-search {
      position: fixed !important;
      top: $navbar-height;
      left: 0;
    }
  }

  .dropCatList {
    position: absolute;
    z-index: $monarch-autocomplete-category-z;
    border-radius: 2px;
    padding-left: 2px;
    padding-right: 2px;
  }

  li:hover {
    background-color: cornflowerblue;
    color: white;
    cursor: pointer;
  }

  .active {
    background-color: cornflowerblue;
    color: white;
  }

  .autorootdiv {
    position: relative;
  }

  .hilite {
    font-weight: bold;
  }

  .example-button{
     background-color:  cadetblue;
  }

  .examples {
    margin-top: 15px;
  }

  .autorootdiv .input-group.input-group-sm {
    width: 400px;
  }

  .autorootdiv.home-search .input-group.input-group-sm {
    width: unset;
  }

  &.home-search {
    margin: 0 10% 0 10%;
  }
}
</style>

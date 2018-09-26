<template>
  <div
    :class="{
      'home-search':homeSearch,
      'open':open
    }"
    class="monarch-autocomplete autocomplete autorootdiv"
  >

    <div
      :class="{'input-group-sm': !homeSearch}"
      class="input-group"
    >
      <div
        v-if="!singleCategory"
        class="input-group-prepend">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          @click="toggleFilterBox"
        >
          All
        </button>
        <div
          v-if="catDropDown"
          class="dropdown-menu list-group dropCatList px-4"
        >
          <div class="form-group">
            <b-form-checkbox-group
              v-model="selected"
              :options="options"
              plain
              stacked/>
          </div>
        </div>
      </div>
      <input
        :class="{'loading': loading}"
        v-model="value"
        class="form-control xform-control-sm"
        type="text"
        placeholder="Search for phenotypes, diseases, genes..."
        @input="debounceInput"
        @keydown="inputChanged"
        @keydown.enter="enter"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.esc="clearSearch"
      >

      <div
        v-if="showSearchButton"
        class="input-group-append">
        <button
          v-b-tooltip.topright
          class="btn xbtn-sm btn-light py-0"
          type="button"
          title="Show all matching results"
          @click="showMore"
        >
          <i class="p-0 m-0 fa xfa-2x fa-search-plus fa-solid"/>
        </button>
      </div>
      <div
        v-if="open"
        class="dropdown-menu list-group dropList px-4"
        style="overflow-y:auto;"
      >
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{'active': isActive(index)}"
          class="border-bottom px-1"
          @click="suggestionClick(index)"
          @mouseover="mouseOver(index)"
        >
          <div class="row p-0">
            <div
              v-if="suggestion.has_hl"
              class="col-5"
            >
              <span v-html="suggestion.highlight"/>
            </div>
            <div
              v-else
              class="col-5"
            >
              <strong>{{ suggestion.match }}</strong>
            </div>
            <div class="col-4"><i>{{ suggestion.taxon }}</i></div>
            <div class="col-3 text-align-right">
              <small>{{ suggestion.category }}</small>
            </div>
          </div>
        </div>
        <div class="row">
          <!--
          <div
            v-if="suggestions.length && !singleCategory"
            class="btn btn-outline-success col m-2"
            v-on:click="showMore"
          >
            Show all results for '{{value}}'
          </div>
 -->
          <div
            v-if="suggestions.length === 0"
            class="btn col m-2"
          >
            No results for '{{ value }}'
          </div>
          <!--
          <div
            class="btn btn-outline-secondary col m-2"
            @click="clearSearch"
          >
            Clear Search
          </div>
 -->

        </div>
      </div>

    </div>

    <div
      v-if="homeSearch"
      class="p-0 m-0">
      Select Example:
      <button
        v-for="(example, index) in exampleSearches"
        :key="index"
        class="btn btn-outline-light m-1 py-0 example-button"
        role="button"
        @click="useExample(example.searchString, example.category)">
        {{ example.searchString }}
        <em v-if="example.category">
          {{ example.category }}
        </em>
      </button>
    </div>

  </div>
</template>

<script>
import * as BL from '@/api/BioLink';

const debounce = require('lodash/debounce');

const exampleSearches = [
  {
    searchString: 'Marfan Syndrome'
  },
  {
    searchString: 'Spinocerebellar Ataxia 2',
    category: 'disease'
  },
  {
    searchString: 'Multicystic kidney dysplasia',
    category: 'phenotype'
  },
  {
    searchString: 'Shh',
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
  props: {
    showSearchButton: {
      type: Boolean,
      required: false,
      default: false
    },
    homeSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    singleCategory: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      selected: [],
      exampleSearches,
      options: [
        { text: 'Gene', value: 'gene' },
        { text: 'Genotype', value: 'genotype' },
        { text: 'Variant', value: 'variant locus' },
        { text: 'Phenotype', value: 'phenotype' },
        { text: 'Disease', value: 'disease' }
      ],
      catDropDown: false,
      value: '',
      suggestions: [],
      open: false,
      current: 0,
      loading: false
    };
  },
  watch: {
    value() {
      if (!this.value) {
        this.open = false;
      }
    },
    selected(newValue) {
      if (!this.singleCategory) {
        this.suggestions = [];
        if (this.value.length > 0) {
          this.fetchData();
        }
      }
    }
  },
  mounted() {
    if (this.singleCategory) {
      this.selected.push(this.singleCategory);
    }
  },
  methods: {
    debounceInput: debounce(
      function debounceInput() {
        this.fetchData();
      }, 500, { leading: false, trailing: true }
    ),
    async fetchData() {
      try {
        const selected = this.selected;
        const searchResponse = await BL.getSearchTermSuggestions(this.value, selected);
        this.suggestions = [];
        searchResponse.docs.forEach((elem) => {
          const resultPacket = {
            match: elem.match,
            category: this.categoryMap(elem.category),
            taxon: this.checkTaxon(elem.taxon_label),
            curie: elem.id,
            highlight: elem.highlight,
            has_hl: elem.has_highlight
          };
          this.suggestions.push(resultPacket);
        });
        this.open = true;
        this.loading = false;
      }
      catch (e) {
        console.log('nodeResponse ERROR', e, this);
      }
    },
    enter() {
      const currentData = this.suggestions[this.current];
      if (!this.singleCategory) {
        this.$router.push({ path: `/${currentData.category}/${currentData.curie}` });
      }
      else {
        this.$emit('interface', this.suggestions[this.current]);
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
    toggleFilterBox() {
      this.catDropDown = !this.catDropDown;
      // if (this.catDropDown) {
      //   this.suggestions = [];
      // }
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
      if (!this.singleCategory) {
        this.$router.push({ path: `/${currentData.category}/${currentData.curie}` });
      }
      else {
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
      this.value = '';
    },
    categoryMap(catList) {
      const validCats = {
        'gene': 'gene',
        'variant locus': 'variant',
        'phenotype': 'phenotype',
        'genotype': 'genotype',
        'disease': 'disease'
      };
      const categoryObj = catList.reduce((map, cat) => {
        const catKey = validCats[cat];
        if (catKey) {
          map[catKey] = catKey;
        }
        return map;
      }, {});
      return categoryObj.gene
        || categoryObj.variant
        || Object.keys(categoryObj).join(',');
    },
    checkTaxon(taxon) {
      if (typeof taxon === 'string') {
        return taxon;
      }
      return null;
    },
    useExample(searchString, category) {
      this.selected = [];
      if (category) {
        this.selected.push(category);
      }

      this.value = searchString;
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
    width:100%;
    border-radius: 2px;
    border: solid black 1px;
  }
  .dropCatList {
    position: absolute;
    z-index: 1001;
    border-radius: 2px;
    padding-left: 2px;
    padding-right: 2px;
  }
  li:hover {
    background-color: cornflowerblue;
    color: white;
  }
  .active {
    background-color: cornflowerblue;
    color: white;
  }

  div.form-group .btn.btn-dark.btn-sm.active {
    border-color: ghostwhite;
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

  .autorootdiv .input-group.input-group-sm {
    width: 400px;
  }

  .autorootdiv.home-search .input-group.input-group-sm {
    width: unset;
  }
}
</style>

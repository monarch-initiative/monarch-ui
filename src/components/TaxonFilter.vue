<template>
  <div
    id="filter"
    :class="{ active: isVisible }"
    class="container-fluid"
  >
    <div class="top-row">
      <b-button class=""  size="sm" @click="toggleSelectedFilter">
        Select All
      </b-button>
      <b-button class="exit" size="sm" @click="hideFilter">
        Apply & Close
      </b-button>
      <p class="warning" v-if="showMessage">You must select at least 1 taxon.</p>
    </div>
    <div
      v-for="(value, key) in taxonFilter.taxons"
      :key="key"
      class="facet-item row">

      <div class="col-lg-10">
        <b-form-checkbox v-on:input="updateTaxonFilter" v-model="taxonFilter.taxons[key]">
          <i>{{ idToLabel(key) }}</i>&nbsp;({{ key }})
        </b-form-checkbox>
      </div>

      <div class="col-lg-2">
        {{ idToCount(key) }}
      </div>

    </div>
  </div>
</template>


<script>
import { idToLabel } from '../lib/TaxonMap';
export default {
  name: 'TaxonFilter',
  model: {
    prop: 'taxonFilter'
  },
  props: {
    taxonFilter: {
      type: Object,
      required: false,
      default: null,
    },
    isVisible: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedAll: true,
      localCopy: {},
      showMessage: false,
      initialDataFlag: false,
    }
  },
  mounted() {

  },
  beforeUpdate(){
    if(!this.initialDataFlag){
      this.initialDataFlag = true;
    }
  },
  watch: {
    isVisible(newval) {
      this.localCopy = JSON.parse(JSON.stringify(this.taxonFilter))
    }
  },
  methods: {
    updateTaxonFilter: function(){
      this.$forceUpdate();
    },
    idToLabel(id) {
      return idToLabel(id);
    },

    idToCount(id) {
      return this.taxonFilter.counts[id];
    },
    hideFilter() {
      if(!Object.values(this.taxonFilter.taxons).includes(true)){
        this.showMessage = true;
      }else {
        this.showMessage = false;
        const newTaxons = Object.values(this.taxonFilter.taxons);
        const originalTaxons = Object.values(this.localCopy.taxons);
        if(!newTaxons.sort().every(function(value, index) { return value === originalTaxons.sort()[index]})){
          this.$emit('toggle-filter', true);
        }else {
          this.$emit('toggle-filter', false);
        }
      }
    },
    toggleSelectedFilter(){
      this.selectedAll = !this.selectedAll;
      for (let key in this.taxonFilter.taxons) {
        this.taxonFilter.taxons[key] = this.selectedAll;
      }
      this.updateTaxonFilter();
    },
  },
};

</script>

<style lang="scss">
@import "~@/style/variables";

$filter-width: 600px;

#filter {
  width: $filter-width;
  display: none;
  position: fixed;
  top: 20%;
  left: 35%;
  min-height: 40px;
  z-index: $monarch-node-sidebar-flyout-z;
  transition: all 0.3s;
  overflow-y: auto;
  overflow-x: hidden;
  background: ghostwhite;
  border:2px solid gray;
  border-radius: 5px;
  font-size: 0.95rem;
  padding: 20px;
}

#filter .warning {
  color: #ba121d;
  text-align: center;
}

#filter.active {
  display: unset;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

#filter .facet-item {
  background: white;

  .custom-control.custom-checkbox label {
    padding-top: 2px;
  }
}

#filter .exit {
  float:right;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

#filter .top-row {
  padding: 5px 15px 0 5px;
  margin-bottom: 15px;

  .btn {
    background-color: $monarch-bg-color;
  }
}

</style>
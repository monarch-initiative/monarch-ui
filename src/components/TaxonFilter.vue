<template>
  <div id="filter" :class="{ active: isVisible }" class="container-fluid">
    <div class="top-row">
      <b-button class="" size="sm" @click="toggleSelectedFilter">
        Select All
      </b-button>
      <b-button class="exit" size="sm" @click="hideFilter">
        Apply & Close
      </b-button>
      <p v-if="showMessage" class="warning">
        You must select at least 1 taxon.
      </p>
    </div>
    <div
      v-for="(value, key) in taxonFilter.taxons"
      :key="key"
      class="facet-item row"
    >
      <div class="col-lg-10">
        <!-- eslint-disable -->
        <b-form-checkbox
          v-model="taxonFilter.taxons[key]"
          @input="updateTaxonFilter"
        >
        <!-- eslint-enable -->
          <i>{{ idToLabel(key) }}</i
          >&nbsp;({{ key }})
        </b-form-checkbox>
      </div>

      <div class="col-lg-2">
        {{ idToCount(key) }}
      </div>
    </div>
  </div>
</template>

<script>
import { idToLabel } from "../lib/taxon-map";

export default {
  name: "TaxonFilter",
  model: {
    prop: "taxonFilter",
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
    };
  },
  watch: {
    isVisible() {
      this.localCopy = JSON.parse(JSON.stringify(this.taxonFilter));
    },
  },
  mounted() {},
  beforeUpdate() {
    if (!this.initialDataFlag) {
      this.initialDataFlag = true;
    }
  },
  methods: {
    updateTaxonFilter() {
      this.$forceUpdate();
    },
    idToLabel(id) {
      return idToLabel(id);
    },

    idToCount(id) {
      return this.taxonFilter.counts[id];
    },
    hideFilter() {
      if (!Object.values(this.taxonFilter.taxons).includes(true)) {
        this.showMessage = true;
      } else {
        this.showMessage = false;
        let isChanged = false;
        const newKeys = Object.keys(this.taxonFilter.taxons);
        const oldKeys = Object.keys(this.localCopy.taxons);
        if (oldKeys.length !== newKeys.length) {
          isChanged = true;
        } else {
          newKeys.forEach((objKey) => {
            if (
              this.taxonFilter.taxons[objKey] !== this.localCopy.taxons[objKey]
            ) {
              isChanged = true;
            }
          });
        }
        if (isChanged) {
          this.$emit("toggle-filter", true);
        } else {
          this.$emit("toggle-filter", false);
        }
      }
    },
    toggleSelectedFilter() {
      this.selectedAll = !this.selectedAll;

      Object.keys(this.taxonFilter.taxons).forEach((taxon) => {
        // eslint-disable-next-line
        this.taxonFilter.taxons[taxon] = this.selectedAll;
      });

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
  border: 2px solid gray;
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
  float: right;
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

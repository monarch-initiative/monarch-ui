<template>
  <div
    id="facets"
    :class="{ active: isVisible }"
    class="container-fluid">

    <div
      v-for="(value, key) in model.selectedTaxons"
      :key="key"
      class="facet-item row">

      <div
        class="col-10">
        <b-form-checkbox
          v-model="model.selectedTaxons[key]"
        >
          <i>{{ idToLabel(key) }}</i>&nbsp;({{ key }})
        </b-form-checkbox>
      </div>

      <div
        class="col-2">
        {{ idToCount(key) }}
      </div>

    </div>
  </div>
</template>


<script>
import { idToLabel } from '../lib/TaxonMap';

export default {
  name: 'NodeSidebarFacets',

  model: {
    prop: 'model',
  },

  props: {
    model: {
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

  methods: {
    idToLabel(id) {
      return idToLabel(id);
    },

    idToCount(id) {
      return this.model.taxons[id];
    },
  },
};

</script>

<style lang="scss">
@import "~@/style/variables";

$facets-width: 500px;

#facets {
  width: $facets-width;
  position: fixed;
  top: ($navbar-height + 95);
  left: (-$facets-width);
  min-height: 40px;
  z-index: $monarch-node-sidebar-flyout-z;
  transition: all 0.3s;
  overflow-y: auto;
  overflow-x: hidden;
  background: ghostwhite;
  border:2px solid gray;
  border-radius: 5px;
  font-size: 0.95rem;
  padding: 5px;
}

#facets.active {
  left: 0;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

#facets .facet-item {
  background: white;

  .custom-control.custom-checkbox label {
    padding-top: 2px;
  }
}

</style>

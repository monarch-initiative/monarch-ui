<template>
  <div
    id="facets"
    :class="{ active: isVisible }">

    <div
      v-for="(value, key) in model"
      :key="key"
      class="facet-item">

      <b-form-checkbox
        v-model="model[key]"
      >
        <i>{{ key }}</i>
      </b-form-checkbox>

    </div>
  </div>
</template>


<script>

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
};

</script>

<style lang="scss">
@import "~@/style/variables";

$facets-width: 300px;

#facets {
  width: $facets-width;
  position: fixed;
  top: ($navbar-height + 105);
  left: (-$facets-width);
  min-height: 40px;
  z-index: 1050;
  transition: all 0.3s;
  overflow-y: auto;
  overflow-x: hidden;
  background: ghostwhite;
  border:2px solid gray;
  border-radius: 5px;
  padding: 5px;
}

#facets.active {
  left: $collapsed-sidebar-width;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}


#facets .facet-item {
  background: white;
  padding: 0;
}

</style>

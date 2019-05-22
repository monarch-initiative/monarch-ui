<template>

  <nav
    id="neighborhood"
    :class="{ active: isVisible }">

    <div class="neighborhood">
      <div
        v-for="c in superclasses"
        :key="c.id"
        class="row superclass">
        <div class="col-12">
          <router-link
            :to="'/' + nodeType + '/' + c.id">
            {{ getLabel(c) }}
          </router-link>
        </div>
      </div>

      <div class="row currentclass">
        <div class="col-12">
          {{ nodeLabel }}
        </div>
      </div>

      <div
        v-for="c in subclasses"
        :key="c.id"
        class="row subclass">
        <div class="col-12">
          <router-link
            :to="'/' + nodeType + '/' + c.id">
            {{ getLabel(c) }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>

</template>


<script>

export default {
  name: 'NodeSidebarNeighborhood',

  props: {
    nodeType: {
      type: String,
      required: false,
      default: '',
    },
    nodeLabel: {
      type: String,
      required: false,
      default: '',
    },
    superclasses: {
      type: Array,
      required: false,
      default: null,
    },
    subclasses: {
      type: Array,
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
    getLabel(c) {
      return c.label || c.id;
    },
  },
};

</script>


<style lang="scss">

@import "~@/style/variables";

$neighborhood-width: 500px;
$neighborhood-button-width: 32px;

#neighborhood {
  width: $neighborhood-width;
  position: fixed;
  top: ($navbar-height + 64);
  left: (-$neighborhood-width);
  min-height: 40px;
  z-index: $monarch-node-sidebar-flyout-z;
  transition: all 0.3s;
  overflow-y: auto;
  overflow-x: hidden;
  background: ghostwhite;
  border:2px solid lightgray;
  border-radius: 5px;
  max-height: 80%;
  font-size: 0.95rem;
  padding: 5px;
}

#neighborhood.active {
  left: 0;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

#neighborhood a,
#neighborhood a:hover,
#neighborhood a:focus {
  padding: 2px 0;
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
}

#neighborhood .neighborhood .superclass {
  margin-left: 0;
}

#neighborhood .neighborhood .currentclass {
  font-weight: 600;
  margin-left: 15px;
}

#neighborhood .neighborhood .subclass {
  margin-left: 30px;
}

#neighborhood .subclass a:hover,
#neighborhood .superclass a:hover,
#neighborhood .currentclass a:hover {
  color: black;
  background: #fff;
  border-color: lightblue;
}

</style>

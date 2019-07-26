<template>

  <div class="node-sidebar">
    <node-sidebar-neighborhood
      :is-visible="isNeighborhoodShowing"
      :node-type="nodeType"
      :node-label="nodeLabel"
      :subclasses="subclasses"
      :superclasses="superclasses"
    />

    <div>
      <ul v-if="nodeType" class="list-group">
        <li class="list-group-item list-group-item-node">
          <a :href="debugServerURL" target="_blank">
            <img :src="$parent.icons[nodeType]" class="entity-type-icon">
            <span class="list-group-item-value">{{ $parent.labels[nodeType] }}</span>
          </a>
          <a
            :href="'http://beta.monarchinitiative.org' + $route.path"
            class="debug-link-to-alpha"
            target="_blank"></a>
        </li>
        <li :class="{ active: !expandedCard }" class="list-group-item list-group-item-squat">
          <b-link @click="expandCard(null)">
            <i class="fa fa-fw fa-th-large"></i>
            <span class="list-group-item-value">Overview</span>
          </b-link>
        </li>

        <li class="list-group-item list-group-item-squat">
          <b-link :disabled="neighborhoodDisabled" @click="toggleNeighborhood()">
            <i class="fa fa-fw fa-share-alt neighbors"></i>
            <span class="list-group-item-value">Neighbors</span>
          </b-link>
        </li>

        <li class="list-group-item list-group-item-squat">
          <b-link :disabled="facetsDisabled" @click="toggleFacets()">
            <i class="fa fa-fw fa-cubes"></i>
            <span class="list-group-item-value">Facets</span>
          </b-link>
        </li>
        <li
          v-for="cardType in cardsToDisplay"
          :class="{ active: expandedCard === cardType }"
          :key="cardType"
          class="list-group-item">
          <a :href="'#' + cardType" @click="expandCard(cardType)">
            <img :src="$parent.icons[cardType]" class="entity-type-icon">
            <span class="list-group-item-value">
              {{ $parent.labels[cardType] }} <span class="count">{{ cardCounts[cardType] }}</span>
            </span>
          </a>
        </li>

      </ul>
    </div>

    <node-sidebar-facets :is-visible="isFacetsShowing" v-model="facetObject"
    />

  </div>

</template>


<script>
import * as biolinkService from '@/api/BioLink';

import NodeSidebarNeighborhood from '@/components/NodeSidebarNeighborhood.vue';
import NodeSidebarFacets from '@/components/NodeSidebarFacets.vue';

export default {
  name: 'NodeSidebar',

  components: {
    'node-sidebar-neighborhood': NodeSidebarNeighborhood,
    'node-sidebar-facets': NodeSidebarFacets,
  },

  props: {
    cardsToDisplay: {
      type: Array,
      required: false,
      default: null,
    },
    expandedCard: {
      type: String,
      required: false,
      default: '',
    },
    cardCounts: {
      type: Object,
      required: false,
      default: null,
    },
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
    facetObject: {
      type: Object,
      required: false,
      default: null,
    },
    isNeighborhoodShowing: {
      type: Boolean,
      required: false,
      default: false,
    },
    isFacetsShowing: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
    };
  },
  computed: {
    neighborhoodDisabled() {
      return (!this.superclasses || this.superclasses.length === 0) && (!this.subclasses || this.subclasses.length === 0);
    },
    facetsDisabled() {
      return false; // this.nodeType === 'publication';
    },
    debugServerURL() {
      const debugHash = (this.$route.hash.length > 1)
        ? (this.$route.hash + 's')
        : '';
      const result = biolinkService.debugServerName() + this.$route.path + debugHash;
      return result;
    },
  },
  created() {
    // console.log('created', this.nodeId);
  },

  updated() {
    // console.log('updated', this.nodeId);
  },

  destroyed() {
    // console.log('destroyed', this.nodeId);
  },

  mounted() {
  },

  methods: {
    expandCard(cardType) {
      this.$emit('expand-card', cardType);
    },

    toggleFacets() {
      this.$emit('toggle-facets');
    },

    toggleNeighborhood() {
      this.$emit('toggle-neighborhood');
    },
  }
};

</script>

<style lang="scss">
@import "~@/style/variables";

$title-bar-height: 70px;
$collapsed-sidebar-width: 50px;

.node-sidebar {
  background: $monarch-bg-color;
  border-right: 1px solid #292e34;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  position: fixed;
  width: $sidebar-width;
  top: ($navbar-height);
  z-index: $monarch-node-sidebar-z;
  box-shadow: -4px -1px 10px 0px;

  a,
  a:hover,
  a:focus {
    color: white;
    text-decoration: none;
    transition: all 0.3s;
  }

  li.list-group-item {
    padding: 5px 0 0 0;
    background-color: transparent;
    border: 0;

    & .fa {
      font-size: 1.6em;

      &.neighbors {
        transform: rotate(90deg);
      }
    }

    & .count {
      float: right;
      padding: 0 15px 0 0;
    }

    > a {
      background-color: transparent;
      color: #d1d1d1;
      cursor: pointer;
      display: block;
      font-size: 0.9rem;
      font-weight: 400;
      font-stretch: condensed;
      line-height: 26px;
      position: relative;
      white-space: nowrap;
      text-decoration: none;
      margin: 0;
      padding: 0 0 0 10px;
      height: 35px;

      &.disabled {
        color: #989898;
        cursor: no-drop;
      }

      &:hover {
        color: white;

        &.disabled {
          color: #989898;
        }
      }
    }

    &.active {
      background: linear-gradient(to left, #262a2b91, #262a2b36,#262a2b0a) !important;
      color: white !important;

      & a {
        color: white;
      }
    }

    &> a img.entity-type-icon {
      margin: 0;
      padding: 0;
      height: 30px;
    }

    &.list-group-item-node {
      .debug-link-to-alpha {
        padding: 0;
        height: 0;
        width: 100%;
        border: 2px solid $monarch-bg-color;

        &:hover {
          border-color: darkslateblue !important;
        }
      }

      > a {
        text-transform: uppercase;
        vertical-align: bottom;
        height: 28px;
      }

      &> a img.entity-type-icon {
        margin: 0 6px 4px 2px;
        height: 27px;
      }
    }

    &.list-group-item-squat {

      a {
        height: 30px;

        i.fa {
          margin: 0 0 0 2px;
          padding: 0;
        }

        .list-group-item-value {
          vertical-align: text-bottom;
        }
      }
    }

    & .list-group-item-value {
      margin: 0 0 0 10px;
    }
  }

  .node-filter-section {
    padding: 0;
    margin-top: 6px;
    height: 250px;
    overflow-y: scroll;
    color: white;

    h5 {
      margin-left:10px;
    }
  }
}

@media (max-width: $sidebar-collapse-width) {
  .node-sidebar {
    width: $collapsed-sidebar-width;

    li.list-group-item > a .list-group-item-value {
      display: none;
    }

    li.node-filter-section {
      display: none;
    }
  }
}

</style>

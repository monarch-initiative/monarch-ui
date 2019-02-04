<template>
  <div>
    <node-sidebar
      v-if="node"
      ref="sidebar"
      :node-type="nodeType"
      :node-label="nodeLabel"
      :expanded-card="expandedCard"
      :available-cards="availableCards"
      :cards-to-display="nonEmptyCards"
      :card-counts="counts"
      :parent-node="node"
      :parent-node-id="nodeId"
      :facet-object="facetObject"
      :is-facets-showing="isFacetsShowing"
      :is-neighborhood-showing="isNeighborhoodShowing"
      :subclasses="subclasses"
      :superclasses="superclasses"
      @expand-card="expandCard"
      @toggle-facets="toggleFacets"
      @toggle-neighborhood="toggleNeighborhood"
    />

    <div class="container-cards">
      <div class="wrapper">

        <div
          :class="{ active: isNeighborhoodShowing || isFacetsShowing }"
          class="overlay"
          @click="hideOverlay()"/>

        <div
          class="title-bar">
          <div
            v-if="!node">
            <div
              v-if="nodeError">
              <small>
                <h6>
                  Error loading {{ labels[nodeType] }}: {{ nodeId }}
                </h6>
                <pre
                  class="pre-scrollable">{{ nodeError }}</pre>
              </small>
            </div>
            <div
              v-else>
              <h5 class="text-center">Loading Data for {{ labels[nodeType] }}: {{ nodeId }}</h5>
            </div>
          </div>

          <div
            v-else>
            <div
              class="node-label">
              <span
                class="node-label-label">
                {{ nodeLabel }}
              </span>
              <span
                v-if="node.taxon.id"
                class="node-label-taxon">
                {{ node.taxon.label }} ({{ node.taxon.id }})
              </span>
              <a
                :href="node.iri"
                target="_blank"
                class="node-label-id">
                {{ node.id }}
              </a>
            </div>

            <div
              class="node-synonyms">
              <span
                v-for="s in synonyms"
                :key="s.val"
                class="synonym"
              >
                {{ s.val }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="node"
          class="container-fluid node-container">

          <div
            v-if="nodeDebug"
            class="row node-content-section">
            <div class="col-12">
              <pre>{{ nodeDebug }}</pre>
            </div>
          </div>

          <div
            v-if="!expandedCard && nodeDefinition"
            class="row node-content-section">
            <div class="col-12">
              <div class="node-description">
                {{ nodeDefinition }}
              </div>
            </div>

            <!--
            <div
              class="col-12 pt-2">
              <b>References:</b>&nbsp;
              <span
                v-for="r in xrefs"
                :key="r.url">
                <router-link
                  v-if="r.url.indexOf('/') === 0"
                  :to="r.url">
                  {{ r.label }}
                </router-link>

                <a
                  v-else-if="r.url && r.blank"
                  :href="r.url"
                  target="_blank">
                  {{ r.label }}
                </a>
                <a
                  v-else-if="r.url"
                  :href="r.url">
                  {{ r.label }}
                </a>

                <span
                  v-else>
                  {{ r.label }}
                </span>
              </span>
            </div>
            -->

            <div class="col-12">
              <span
                v-if="inheritance">
                <b>Heritability:</b>&nbsp;{{ inheritance }}
              </span>
            </div>

            <div class="col-12">
              <span
                v-if="inheritance">
                <b>Clinical Modifiers:</b>&nbsp;{{ modifiers }}
              </span>
            </div>

            <div class="col-12">
              <b>Equivalent IDs:</b>&nbsp;

              <span
                v-for="r in equivalentClasses"
                :key="r.id">
                <router-link
                  v-if="r.id"
                  :to="'/resolve/' + r.id">
                  {{ r.label || r.id }}
                </router-link>

                <span
                  v-else>
                  {{ r.label }}
                </span>
              </span>
            </div>

            <div class="col-12">
              <b>URI:</b>&nbsp;
              <a
                :href="node.uri"
                target="_blank"
                rel="noopener noreferrer">
                {{ node.uri }}
              </a>
            </div>

          </div>

          <div
            v-if="!expandedCard"
            class="row node-cards-section">
            <node-card
              v-for="cardType in nonEmptyCards"
              :key="cardType"
              :card-type="cardType"
              :card-count="counts[cardType]"
              :parent-node="node"
              :parent-node-id="nodeId"
              @expand-card="expandCard(cardType)"/>
          </div>
          <div
            v-if="!expandedCard && hasGeneExac"
            class="row">
            <exac-gene
              :node-id="nodeId"/>
          </div>

          <div
            v-if="!expandedCard && hasGeneTrack && node.geneInfo"
            class="row">
            <genome-feature
              :mygene-data="node.geneInfo"/>
          </div>

          <div
            v-if="expandedCard"
            class="expanded-card-view col-12">
            <assoc-table
              :facets="facetObject"
              :node-type="nodeType"
              :card-type="expandedCard"
              :identifier="nodeId"
            />
          </div>
          <div v-if="!expandedCard && nodeType === 'variant'">
            <exac-variant
              :node-id="nodeId"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import us from 'underscore';
import * as BL from '@/api/BioLink';
import * as MyGene from '@/api/MyGene';

import NodeSidebar from '@/components/NodeSidebar.vue';
import NodeCard from '@/components/NodeCard.vue';
import AssocTable from '@/components/AssocTable.vue';
import ExacGeneSummary from '@/components/ExacGeneSummary.vue';
import ExacVariantTable from '@/components/ExacVariantTable.vue';
import GenomeFeature from '@/components/GenomeFeature.vue';

const availableCardTypes = [
  'anatomy',
  'cellline',
  'disease',
  'function',
  'gene',
  'genotype',
  'homolog',
  'interaction',
  'literature',
  'model',
  'ortholog-phenotype',
  'ortholog-disease',
  'pathway',
  'phenotype',
  'variant'
];

const icons = {
  anatomy: require('../assets/img/icon-anatomy.png'),
  cellline: require('../assets/img/icon-anatomy.png'),
  disease: require('../assets/img/icon-diseases.png'),
  function: require('../assets/img/icon-anatomy.png'),
  gene: require('../assets/img/icon-genes.png'),
  genotype: require('../assets/img/icon-anatomy.png'),
  homolog: require('../assets/img/icon-anatomy.png'),
  interaction: require('../assets/img/icon-anatomy.png'),
  literature: require('../assets/img/icon-anatomy.png'),
  model: require('../assets/img/icon-models.png'),
  'ortholog-disease': require('../assets/img/icon-anatomy.png'),
  'ortholog-phenotype': require('../assets/img/icon-anatomy.png'),
  pathway: require('../assets/img/icon-anatomy.png'),
  phenotype: require('../assets/img/icon-phenotypes.png'),
  variant: require('../assets/img/icon-genes.png')
};

const labels = {
  anatomy: 'Anatomy',
  cellline: 'Cell Line',
  disease: 'Disease',
  function: 'Function',
  gene: 'Gene',
  genotype: 'Genotype',
  homolog: 'Homolog',
  interaction: 'Interaction',
  literature: 'Literature',
  model: 'Model',
  'ortholog-phenotype': 'Ortholog Phenotype',
  'ortholog-disease': 'Ortholog Disease',
  pathway: 'Pathway',
  phenotype: 'Phenotype',
  variant: 'Variant',
};

export default {
  components: {
    'node-sidebar': NodeSidebar,
    'node-card': NodeCard,
    'assoc-table': AssocTable,
    'exac-gene': ExacGeneSummary,
    'exac-variant': ExacVariantTable,
    'genome-feature': GenomeFeature,
  },

  data() {
    return {
      isFacetsShowing: false,
      isNeighborhoodShowing: false,
      facetObject: {
        species: {
          'Anolis carolinensis': true,
          'Arabidopsis thaliana': true,
          'Bos taurus': true,
          'Caenorhabditis elegans': true,
          'Danio rerio': true,
          'Drosophila melanogaster': true,
          'Equus caballus': true,
          'Gallus gallus': true,
          'Homo sapiens': true,
          'Macaca mulatta': true,
          'Monodelphis domestica': true,
          'Mus musculus': true,
          'Ornithorhynchus anatinus': true,
          'Pan troglodytes': true,
          'Rattus norvegicus': true,
          'Saccharomyces cerevisiae': true,
          'Saccharomyces cerevisiae S288C': true,
          'Sus scrofa': true,
          'Xenopus (Silurana) tropicalis': true
        },
        evidence: {
          IEA: true
        },
        systems: {
          'Skeletal system': true,
          'Limbs': true,
          'Nervous system': true,
          'Head or neck': true,
          'Metabolism/homeostasis': true,
          'Cardiovascular system': true,
          'Integument': true,
          'Genitourinary system': true,
          'Eye': true,
          'Musculature': true,
          'Neoplasm': true,
          'Digestive system': true,
          'Immune System': true,
          'Blood and blood-forming tissues': true,
          'Endocrine': true,
          'Respiratory system': true,
          'Ear': true,
          'Connective tissue': true,
          'Prenatal development or birth': true,
          'Growth': true,
          'Constitutional': true,
          'Thoracic cavity': true,
          'Breast': true,
          'Voice': true,
          'Cellular': true
        }
      },
      isSelected: {
        phenotypes: false,
        genes: false,
        models: false,
        diseases: false
      },
      node: null,
      nodeError: null,
      equivalentClasses: null,
      superclasses: null,
      subclasses: null,
      synonyms: null,
      inheritance: null,
      modifiers: null,
      contentScript: '',
      contentBody: '',
      progressTimer: null,
      path: null,
      icons,
      labels,
      nodeId: null,
      nodeType: null,
      nodeDebug: null,
      nodeIcon: null,
      nodeCategory: null,
      availableCards: availableCardTypes,
      nonEmptyCards: [],
      expandedCard: null,
      hasGeneExac: false,
      hasGeneTrack: false,
      counts: {
        disease: 0,
        phenotype: 0,
        gene: 0,
        variant: 0,
        model: 0,
        pathway: 0,
        literature: 0,
        cellline: 0,
        genotype: 0
      },
      relationshipsColumns: [
        {
          label: 'Subject',
          field: 'subject.id'
        },
        {
          label: 'Property',
          field: 'property.id'
        },
        {
          label: 'Object',
          field: 'object.id'
        },
        {
          label: 'Source',
          field: 'source'
        }
      ]
    };
  },

  computed: {
    nodeLabel() {
      return `${this.node.label} ${this.node.geneLabel || ''}`;
    },
    nodeDefinition() {
      return `${this.node.description} ${this.node.geneDescription || ''}`;
    }
  },

  watch: {
    $route(to, _from) {
      // Only fetchData if the path is different.
      // hash changes are currently handled by monarch-tabs.js
      // within the loaded MonarchLegacy component.

      if (to.path !== this.path) {
        this.fetchData();
      }
    }
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
    this.fetchData();
  },

  methods: {
    expandCard(cardType) {
      this.$router.replace({ hash: cardType });
      this.expandedCard = cardType;
    },

    hideOverlay() {
      this.isFacetsShowing = false;
      this.isNeighborhoodShowing = false;
    },

    toggleFacets() {
      this.isNeighborhoodShowing = false;
      this.isFacetsShowing = !this.isFacetsShowing;
    },

    toggleNeighborhood() {
      this.isFacetsShowing = false;
      this.isNeighborhoodShowing = !this.isNeighborhoodShowing;
    },

    // TIP/QUESTION: This applyResponse is called asynchronously via the function
    // fetchData when it's promise is fulfilled. We (as VueJS newbies) aren't
    // yet certain how this fits into the Vue lifecycle and we may eventually
    // need to apply $nextTick() to deal with this. Keep an eye out for UI fields
    // not updating or having undefined values.
    //
    applyResponse(response) {
      // console.log('applyResponse', response);
      const that = this;
      this.node = response;
      // this.nodeDebug = JSON.stringify(response, null, 2);

      const neighborhood = BL.getNeighborhoodFromResponse(response);
      const nodeLabelMap = neighborhood.nodeLabelMap;
      const equivalentClasses = neighborhood.equivalentClasses;
      const superclasses = neighborhood.superclasses;
      const subclasses = neighborhood.subclasses;

      this.superclasses = us.map(us.uniq(superclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      this.subclasses = us.map(us.uniq(subclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      this.equivalentClasses = us.map(us.uniq(equivalentClasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      // console.log('superclasses', this.superclasses);
      // console.log('subclasses', this.subclasses);
      // console.log('equivalentClasses', this.equivalentClasses);

      this.synonyms = this.node.synonyms;
      this.xrefs = this.node.xrefs;
      this.inheritance = this.node.inheritance ? this.node.inheritance : null;
      this.modifiers = this.node.modifiers ? this.node.modifiers : null;
      this.nodeCategory = this.node.categories
        ? this.node.categories[0].toLowerCase()
        : this.nodeType;
      this.nodeIcon = this.icons[this.nodeCategory];
      this.phenotypeIcon = this.icons.phenotype;
      this.geneIcon = this.icons.gene;
      this.modelIcon = this.icons.model;
      this.hasGeneExac = (this.nodeType === 'gene' || this.nodeType === 'variant');
      this.hasGeneTrack = (this.nodeType === 'gene' || this.nodeType === 'variant');

      const nonEmptyCards = [];
      this.availableCards.forEach((cardType) => {
        const count = that.node.counts[cardType];
        that.counts[cardType] = count ? count.totalCount : 0;
        if (that.counts[cardType] > 0) {
          nonEmptyCards.push(cardType);
        }
      });
      this.nonEmptyCards = nonEmptyCards;

      const hash = this.$router.currentRoute.hash;
      if (hash.length > 1) {
        const cardType = hash.slice(1);
        this.$nextTick((_) => {
          this.expandCard(cardType);
        });
      }
    },

    startProgress() {
      const that = this;
      if (that.progressTimer) {
        console.log('startProgress.... leftover progressTimer');
      }
      else {
        that.progressTimer = setTimeout(function timeout() {
          that.progressTimer = null;
        }, 500);
      }
    },

    clearProgress() {
      const that = this;
      that.$nextTick(function clearProgress() {
        if (that.progressTimer) {
          clearTimeout(that.progressTimer);
          that.progressTimer = null;
        }
      });
    },

    async fetchData() {
      const path = this.$route.fullPath;

      this.path = this.$route.path;
      this.nodeId = this.$route.params.id;
      this.nodeType = this.path.split('/')[1];
      // TIP: setup the pre-fetch state, waiting for the async result
      this.node = null;
      this.nodeError = null;
      this.hasGeneTrack = false;
      this.expandedCard = null;
      this.nonEmptyCards = [];
      this.isFacetsShowing = false;
      this.isNeighborhoodShowing = false;
      this.startProgress();

      try {
        const nodeResponse = await BL.getNodeSummary(this.nodeId, this.nodeType);

        if (this.hasGeneTrack) {
          const geneInfo = await MyGene.getGeneDescription(this.nodeId);
          const hit = geneInfo.hits[0];
          console.log('geneInfo', nodeResponse, hit);

          nodeResponse.geneLabel = `${hit.name}/${hit.symbol}`;
          nodeResponse.geneSymbol = `${hit.name}/${hit.symbol}`;
          nodeResponse.geneDescription = hit.summary;
          nodeResponse.geneInfo = geneInfo;
        }

        this.applyResponse(nodeResponse);
        this.clearProgress();
      }
      catch (e) {
        console.log('nodeResponse ERROR', e, this);
        this.nodeError = e;
        this.clearProgress();
      }

      // TIP: Don't put anything useful here, because this will execute BEFORE
      // the async operation has even been queued and before it has returned
      // a useful result or error.
    }
  }
};

</script>

<style lang="scss">
@import "~@/style/variables";

$sidebar-content-width: 500px;
$sidebar-width: 200px;
$sidebar-button-width: 32px;
$title-bar-height: 80px;
$line-height-compact: 1.3em;

.overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  display: none;
}

.overlay.active {
    display: initial;
}

.node-container {
  margin: $title-bar-height 0 5px 0;
  padding: 0;
  transition: all 0.3s;
  width: 100%;
  height: 100%;
}

.expanded-card-view {
  margin:0;
  padding:0;
  width:100%;
  height:100%;
}

.node-container .node-description {
  margin: 0;
  padding: 5px 5px;
  line-height: $line-height-compact;
}

.wrapper {
  display: flex;
  align-items: stretch;
  min-height: 100%;
  width: 100%;
  margin: 0;
  padding: 5px;
}


div.container-cards {
  width: unset;
  padding: 0;
  margin: $navbar-height 0 0 $sidebar-width;
}

div.container-cards .node-content-section {
  line-height: $line-height-compact;
}

div.container-cards .node-cards-section {
  margin-top: 10px;
}

.title-bar {
  border-bottom:1px solid lightgray;
  background: aliceblue;
  position: fixed;
  height: $title-bar-height;
  max-height: $title-bar-height;
  overflow-y: auto;
  xfont-size: 1.0em;
  line-height: $line-height-compact;
  top: ($navbar-height);
  left: 0;
  right: 222px;
  padding: 5px;
  padding-left: ($sidebar-width + 5);
  margin: 0;
  width: 100%;
  z-index: 1;
}

.title-bar .node-synonyms {
  line-height: $line-height-compact;
}

.title-bar .synonym {
  padding: 2px 10px 1px 2px;
  font-size: 0.9em;
  background: white;
}

.title-bar .node-label {
  margin: 2px 5px 5px 2px;
}

.title-bar .node-label-label {
  font-size: 1.4em;
  font-weight: 500;
}

.title-bar .node-label-id {
}

.title-bar .node-label-taxon {
}

@media (max-width: $grid-float-breakpoint) {
  div.container-cards {
    margin-left: $collapsed-sidebar-width;
  }

  .title-bar {
    padding-left: ($collapsed-sidebar-width + 5);
  }

}

</style>

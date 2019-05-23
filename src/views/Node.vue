<template>
  <div>
    <node-sidebar
      v-if="node"
      ref="sidebar"
      :node-type="nodeType"
      :node-label="node.label"
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
              <br>
              <h5 class="text-center">Loading Data for {{ labels[nodeType] }}: {{ nodeId }}</h5>
            </div>
          </div>

          <div
            v-else>
            <div
              class="node-label">
              <span
                class="node-label-label">
                {{ node.label }}
              </span>
              <span
                v-if="node.taxon && node.taxon.id"
                class="node-label-taxon">
                &nbsp;
                <a
                  :href="node.taxon.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="node-label-id">
                  <em>{{ node.taxon.label }}</em>
                </a>
              </span>
              &nbsp;

              <!--
              <a
                v-if="entrezResult && entrezResult.abstractURL"
                :href="entrezResult.abstractURL"
                target="_blank"
                rel="noopener noreferrer"
                class="node-label-id">
                Entrez: {{ node.id }}
              </a>
             -->
            </div>

            <div
              class="node-synonyms">
              <span
                v-for="(s, index) in synonyms"
                :key="index"
                class="synonym"
              >
                {{ s }}
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
            v-if="!expandedCard"
            class="row node-content-section">
            <div
              v-if="node.description"
              class="col-12">
              <div class="node-description">
                {{ node.description }}
              </div>
            </div>

            <template
              v-if="entrezResult">
              <h6>Date: {{ entrezResult.pubdate }}</h6>
              <h6>Authors:
                {{ entrezResult.authors.map(a => { return a.name; }).join(', ') }}
              </h6>

              <div
                v-if="entrezResult"
                class="publication-abstract"
                v-html="entrezResult.abstractMarkdown"/>
            </template>

            <div class="col-12">
              <span
                v-if="inheritance">
                <b>Heritability:</b>&nbsp;{{ inheritance }}
              </span>
            </div>

            <div class="col-12">
              <span
                v-if="modifiers">
                <b>Clinical Modifiers:</b>&nbsp;{{ modifiers }}
              </span>
            </div>

            <div
              class="col-12">
              <b>References:</b>&nbsp;
              <span
                v-for="(r, index) in references"
                :key="index"
                class="synonym"
              >
                <a
                  :href="r.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="node-label-id">
                  {{ r.label }}
                </a>
              </span>
            </div>

            <div
              v-if="equivalentClasses && equivalentClasses.length > 0"
              class="col-12">
              <b>Equivalent IDs:</b>&nbsp;

              <span
                v-for="(r, index) in equivalentClasses"
                :key="index">
                <span>
                  {{ r.id }}&nbsp;
                </span>
              </span>
            </div>
          </div>

          <div
            v-if="!expandedCard"
            class="row node-cards-section">
            <node-card
              v-for="cardType in nonEmptyCards"
              :key="cardType"
              :card-type="cardType"
              :card-count="counts"
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
            v-if="!expandedCard && node.geneInfo && node.geneInfo.externalURL"
            class="row">
            <genome-feature
              :mygene-data="node.geneInfo"/>
          </div>

          <div
            v-if="expandedCard"
            class="expanded-card-view row">
            <assoc-table
              :facets="facetObject"
              :card-counts="counts"
              :node-type="nodeType"
              :card-type="expandedCard"
              :node-id="nodeId"
            />
          </div>
          <div v-if="!expandedCard && nodeType === 'variant'">
            <exac-variant
              :node-id="nodeId"/>
          </div>
        </div>
      </div>
    </div>
    <script
      type="application/ld+json"
      v-html="jsonld"/>
  </div>
</template>


<script>

import us from 'underscore';
import * as BL from '@/api/BioLink';
import * as MyGene from '@/api/MyGene';
import * as Entrez from '@/api/Entrez';

import NodeSidebar from '@/components/NodeSidebar.vue';
import NodeCard from '@/components/NodeCard.vue';
import AssocTable from '@/components/AssocTable.vue';
import ExacGeneSummary from '@/components/ExacGeneSummary.vue';
import ExacVariantTable from '@/components/ExacVariantTable.vue';
import GenomeFeature from '@/components/GenomeFeature.vue';

import MarkdownIt from 'markdown-it';

const availableCardTypes = [
  'anatomy',
  'cellline',
  'disease',
  'function',
  'gene',
  'genotype',
  'homolog',
  'interaction',
  'publication',
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
  publication: require('../assets/img/icon-anatomy.png'),
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
  publication: 'Publication',
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
      jsonld: [
        {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          'url': 'https://monarchinitiative.org',
          'email': 'info@monarchinitiative.org'
        },
        // specify actions
        {
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          'url': 'https://monarchinitiative.org',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://monarchiniative.org/search/{term}',
            'query-input': 'required name=term'
          }
        },
      ],
      isFacetsShowing: false,
      isNeighborhoodShowing: false,
      facetObject: {
        selectedTaxons: {
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
      references: null,
      inheritance: null,
      modifiers: null,
      contentScript: '',
      contentBody: '',
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
      entrezResult: null,

      counts: {
        disease: 0,
        phenotype: 0,
        gene: 0,
        variant: 0,
        model: 0,
        pathway: 0,
        publication: 0,
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
  },

  watch: {
    facetObject: {
      handler(val, oldVal) {
        // console.log('facetObject');
        // console.log(JSON.stringify(val.selectedTaxons, null, 2));
        this.updateCounts();
      },
      deep: true
    },

    $route(to, _from) {
      // Only fetchData if the path is different.

      if (to.path !== this.path) {
        this.fetchData();
      }
      else {
        const strippedHash = to.hash.slice(1);
        if (strippedHash !== this.cardType) {
          this.expandCard(strippedHash);
        }
      }
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
    this.fetchData();
  },

  methods: {
    expandCard(cardType) {
      this.$router.push({ hash: cardType });
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

    updateCounts() {
      // console.log(JSON.stringify(Object.keys(this.node.association_counts), null, 2));
      // console.log(JSON.stringify(Object.keys(this.node.taxonCounts), null, 2));
      const nonEmptyCards = [];
      if (!this.node.association_counts) {
        console.log('Missing association_counts', this.node);
      }
      else {
        // console.log('association_counts', Object.keys(this.node.association_counts).join(','));
        // console.log(JSON.stringify(this.node.association_counts, null, 2));
        // console.log('taxonCounts', Object.keys(this.node.taxonCounts).join(','));
        // console.log(JSON.stringify(this.node.taxonCounts, null, 2));
        this.availableCards.forEach((cardType) => {
          const taxonCount = this.node.taxonCounts[cardType];
          const taxonTotal = taxonCount ? taxonCount.total : 0;
          let taxonFiltered = taxonTotal;
          if (taxonCount) {
            // console.log('taxonCount', taxonCount);
            Object.keys(taxonCount.taxons).forEach((t) => {
              // console.log('this.facetObject.selectedTaxons', this.facetObject.selectedTaxons, this.facetObject.selectedTaxons[t], t);
              if (!this.facetObject.selectedTaxons[t]) {
                taxonFiltered -= taxonCount.taxons[t];
              }
            });
          }

          const acount = this.node.association_counts[cardType] || 0;
          // console.log('xx', cardType, acount, taxonTotal, taxonFiltered);
          // console.log('updateCounts', cardType, acount);

          if (acount > 0 && taxonTotal === 0) {
            // console.log('mismatch1', acount, taxonFiltered, taxonCount, cardType);
            taxonFiltered = acount;
          }
          if (acount > 0 && taxonFiltered !== acount) {
            // console.log('mismatch2', acount, taxonFiltered, taxonCount.total, cardType);
            // taxonFiltered = acount;
          }
          this.counts[cardType] = taxonFiltered;
          if (acount > 0) {
            nonEmptyCards.push(cardType);
          }
        });
      }
      this.nonEmptyCards = nonEmptyCards;
    },

    async fetchData() {
      const path = this.$route.fullPath;

      this.path = this.$route.path;
      this.nodeId = this.$route.params.id;
      this.nodeType = this.path.split('/')[1];

      // TIP: setup the pre-fetch state, waiting for the async result
      this.node = null;
      this.nodeError = null;
      this.entrezResult = null;
      this.expandedCard = null;
      this.nonEmptyCards = [];
      this.isFacetsShowing = false;
      this.isNeighborhoodShowing = false;
      this.inheritance = null;
      this.modifiers = null;

      const nodeSummaryPromise = BL.getNode(this.nodeId, this.nodeType);
      const neighborhoodPromise = BL.getNeighborhood(this.nodeId, this.nodeType);

      const [nodeSummary, neighborhood] = await Promise.all(
        [
          nodeSummaryPromise,
          neighborhoodPromise
        ]
      );
      this.node = nodeSummary;

      if (this.node.synonyms) {
        this.synonyms = this.node.synonyms.map(s => s.val);
      }
      else {
        this.synonyms = [];
      }

      if (this.node.xrefs) {
        this.references = this.node.xrefs.map(s => ({
          label: s,
          uri: s
        }));
      }
      else {
        this.references = [];
      }
      // We'll insert our node's id/uri as the first reference.
      this.references.unshift({
        label: this.node.id,
        uri: this.node.uri
      });

      if (this.nodeType === 'publication') {
        const entrezResult = await Entrez.getPublication(this.nodeId);

        if (!entrezResult) {
          console.log('Entrez.getPublication null for ', this.nodeId);
        }
        else {
          this.entrezResult = entrezResult;
          nodeSummary.label = entrezResult.title;
          nodeSummary.uri = entrezResult.pubmedURL;

          let abstractEnhanced = this.entrezResult.abstract;
          abstractEnhanced = abstractEnhanced.replace(
            // /^([A-Z]+): /g,
            /\n([A-Z]+): /g,
            `\n\n##### $1\n\n`
          );
          // console.log(JSON.stringify(abstractEnhanced.slice(0, 100), null, 2));
          const md = new MarkdownIt();
          const mdRendered = md.render(abstractEnhanced);
          this.entrezResult.abstractMarkdown = mdRendered;
          // console.log(JSON.stringify(mdRendered.slice(0, 100), null, 2));
        }
      }

      //
      // Because Monarch doesn't ingest gene descriptions, we must
      // asynchronously pull these from MyGene. In the future, BioLink
      // may provide this data, either by ingest or by making the MyGene
      // call from the BioLink server.
      //

      if ((this.nodeType === 'gene' || this.nodeType === 'variant')) {
        const geneInfo = await MyGene.getGeneDescription(this.nodeId);
        const hit = geneInfo && geneInfo.hits[0];
        if (hit) {
          if (nodeSummary.description) {
            console.log('Overriding nodeSummary.description with hit.summary', nodeSummary.description, hit.summary);
          }

          nodeSummary.description = hit.summary;

          nodeSummary.geneInfo = geneInfo;
          if (this.synonyms.indexOf(hit.name) !== -1) {
            this.synonyms.unshift(hit.name);
          }
        }
      }

      //
      // If there a taxon for the current node, then build
      // a nice URL
      //
      const ncbiTaxonPrefix = 'NCBITaxon:';
      if (this.node.taxon &&
          this.node.taxon.id &&
          this.node.taxon.id.indexOf(ncbiTaxonPrefix) === 0) {
        const taxonNumber = this.node.taxon.id.slice(ncbiTaxonPrefix.length);
        this.node.taxon.uri = `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=${taxonNumber}`;
      }

      //
      // Build the information needed to populate the taxon facet
      // component.
      //

      const taxons = {};
      const selectedTaxons = {};
      Object.keys(nodeSummary.taxonCounts).forEach((key) => {
        const entry = nodeSummary.taxonCounts[key];
        Object.keys(entry.taxons).forEach((taxon) => {
          // console.log(key, taxon, entry.taxons[taxon]);
          selectedTaxons[taxon] = true;
          let taxonCount = taxons[taxon];
          if (!taxonCount) {
            taxonCount = 0;
          }
          else {
            // console.log('prexisting taxons[taxon]', key, taxon, taxonCount);
          }
          taxons[taxon] = taxonCount + entry.taxons[taxon];
        });
      });
      this.facetObject.taxons = taxons;
      this.facetObject.selectedTaxons = selectedTaxons;


      //
      // Build out the superclass/subclass/equivclass lists from
      // the info provided by getNeighborhood()
      //
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

      if (this.node.inheritance) {
        this.inheritance = this.node.inheritance.map(i => i.label).join(', ');
      }
      if (this.node.clinical_modifiers) {
        this.modifiers = this.node.clinical_modifiers.map(m => m.label).join(', ');
      }

      this.nodeCategory = this.node.categories
        ? this.node.categories[0].toLowerCase()
        : this.nodeType;
      this.nodeIcon = this.icons[this.nodeCategory];
      this.phenotypeIcon = this.icons.phenotype;
      this.geneIcon = this.icons.gene;
      this.modelIcon = this.icons.model;
      this.hasGeneExac = (this.nodeType === 'gene' || this.nodeType === 'variant');

      //
      // Update all the node counts based upon the taxon facets,
      // although initially this will be all taxons.
      //
      this.updateCounts();

      //
      // If we got here via someone specifying a cardType in the
      // URL hash, then expand that cardType.
      //
      const hash = this.$router.currentRoute.hash;
      if (hash.length > 1) {
        const cardType = hash.split('?')[0].slice(1);
        this.$nextTick((_) => {
          this.expandCard(cardType);
        });
      }
    }
  }
};

</script>

<style lang="scss">
@import "~@/style/variables";

$sidebar-content-width: 500px;
$sidebar-width: 200px;
$sidebar-button-width: 32px;
$title-bar-max-height: 100px;
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

.container-fluid.node-container {
  margin-top: $title-bar-max-height;
  xpadding: 0;
  transition: all 0.3s;
  width: 100%;
  height: 100%;

  .expanded-card-view {
    padding:0;
  }
}

.node-container .node-description {
  margin: 0 -5px;
  padding: 10px 5px;
  line-height: $line-height-compact;
  border-radius: 5px;
  background: mintcream;
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
  border-bottom: 1px solid lightgray;
  background: aliceblue;
  position: fixed;
  min-height: ($title-bar-max-height * 3/4);
  max-height: $title-bar-max-height;
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
  line-height: 1.0em;
  margin: 5px;
  padding: 0 5px;
}

.title-bar .synonym {
  padding: 0 2px;
  margin: 0 15px 0 0;
  font-size: 0.9em;
  font-weight: 500;
}

.title-bar .node-label {
  margin: 2px;
}

.title-bar .node-label-label {
  font-size: 1.4em;
  font-weight: 500;
}

.title-bar .node-label-id {
}

.title-bar .node-label-taxon {
}

div.publication-abstract {
  margin: 0;
  padding: 10px;
}

@media (max-width: $sidebar-collapse-width) {
  div.container-cards {
    margin-left: $collapsed-sidebar-width;
  }

  .title-bar {
    padding-left: ($collapsed-sidebar-width + 5);
  }

}

</style>

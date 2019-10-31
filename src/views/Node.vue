<template>
  <div class="node-wrapper">
    <node-sidebar
      v-if="node"
      ref="sidebar"
      :node-type="nodeType"
      :node-label="node.label"
      :is-group="isGroup"
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
        <div :class="{ active: isNeighborhoodShowing || isFacetsShowing }" class="overlay"/>

        <div v-if="!node" class="loading">
          <div v-if="nodeError">
            <small>
              <h6>
                Error loading {{ labels[nodeType] }}:&nbsp; {{ nodeId }}
              </h6>
              <pre class="pre-scrollable">{{ nodeError }}</pre>
            </small>
          </div>
          <div v-else>
            <b-spinner class="loading-spinner" type="grow" label="Spinning"/>
            <h5 class="text-center">{{ nodeId }}</h5>
          </div>
        </div>

        <div v-else ref="titleBar" class="title-bar">
          <h4 class="node-label-label">
            <span v-html="node.label"/>&nbsp;<span class="node-label-id">{{ node.id }}</span>
            <span v-if="originalId" class="node-label-id">
              (Redirected from {{ originalId }})
            </span>
          </h4>
          <span v-if="node.taxon && node.taxon.id" class="node-label-taxon">
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
        <div v-if="node" class="container-fluid node-container">
          <div v-if="!expandedCard" class="row node-content-section">
            <div v-if="node.description" class="col-12">
              <div class="node-description">
                <b>Description</b><br>
                <div class="description">
                  <div v-html="node.description"/>
                </div>
              </div>
            </div>
            <div v-if="entrezResult" class="col-12">
              <h6>Date: {{ entrezResult.pubdate }}</h6>
              <h6>Authors:
                {{ entrezResult.authors.map(a => { return a.name; }).join(', ') }}
              </h6>

              <div v-if="entrezResult" class="publication-abstract" v-html="entrezResult.abstractMarkdown"/>
            </div>

            <div class="col-12">
              <span v-if="inheritance">
                <b>Heritability:</b>&nbsp;{{ inheritance }}
              </span>
            </div>

            <div class="col-12">
              <span v-if="modifiers">
                <b>Clinical Modifiers:</b>&nbsp;{{ modifiers }}
              </span>
            </div>
          </div>

          <div v-if="!expandedCard" class="row node-content-section">

            <div v-if="references.length" class="col-12">
              <span v-if="nodeType === 'disease'"><b>Mappings:</b>&nbsp;</span>
              <span v-else><b>External Resources:</b>&nbsp;</span>
              <span v-for="(r, index) in references" :key="index" class="synonym">
                <span v-if="r.uri">
                  <span class="reference-external">
                    <a
                      :href="r.uri"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="node-label-id">
                      {{ r.label }}
                      <i class="fa fa-external-link" aria-hidden="true"/>
                    </a>
                  </span>
                </span>
                <span v-else>
                  {{ r.label }}
                </span>
                &nbsp;
              </span>
            </div>

            <div v-if="node.synonyms" class="col-12 node-synonyms">
              <b>Synonyms</b><br><br>
              <ul>
                <li v-for="(s, index) in synonyms" :key="index" class="synonym">
                  {{ s }}
                </li>
              </ul>
            </div>

          </div>


          <div v-if="!expandedCard && hasGeneExac" class="row py-2">
            <exac-gene :node-id="nodeId"/>
          </div>

          <div v-if="!expandedCard && node.geneInfo && node.geneInfo.externalURL" class="row py-2">
            <genome-feature
              :mygene-data="node.geneInfo"/>
          </div>

          <div v-if="!expandedCard && reactomeId" class="row py-0">
            <reactome-viewer :reactome-id="reactomeId"/>
          </div>

          <!--<div v-if="!expandedCard" class="row node-cards-section">
            <node-card
              v-for="cardType in nonEmptyCards"
              :key="cardType"
              :card-type="cardType"
              :card-count="counts"
              :parent-node="node"
              :parent-node-id="nodeId"
              @expand-card="expandCard(cardType)"/>
          </div>-->

          <div v-if="expandedCard" class="expanded-card-view">
            <assoc-table
              :facets="facetObject"
              :card-counts="counts"
              :node-type="nodeType"
              :card-type="expandedCard"
              :node-id="nodeId"
              :is-group="isGroup"
            />
          </div>
          <div v-if="!expandedCard && nodeType === 'variant'">
            <exac-variant :node-id="nodeId"/>
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
import * as biolinkService from '@/api/BioLink';
import * as MyGene from '@/api/MyGene';
import * as Entrez from '@/api/Entrez';
import { getXrefUrl, processSources } from '@/lib/Utils';

import NodeSidebar from '@/components/NodeSidebar.vue';
import NodeCard from '@/components/NodeCard.vue';
import AssocTable from '@/components/AssocTable.vue';
import ExacGeneSummary from '@/components/ExacGeneSummary.vue';
import ExacVariantTable from '@/components/ExacVariantTable.vue';
import GenomeFeature from '@/components/GenomeFeature.vue';
import ReactomeViewer from '@/components/ReactomeViewer.vue';

import MarkdownIt from 'markdown-it';


// https://stackoverflow.com/a/34064434/5667222
function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}


const availableCardTypes = [
  'anatomy',
  'cellline',
  'disease',
  'causal-disease',
  'noncausal-disease',
  'function',
  'gene',
  'causal-gene',
  'noncausal-gene',
  'genotype',
  'case',
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
  anatomy: require('../assets/img/monarch-ui-icon_ANATOMY.png'),
  cellline: require('../assets/img/monarch-ui-icon_CELL_LINE.png'),
  disease: require('../assets/img/monarch-ui-icon_DISEASE.png'),
  'causal-disease': require('../assets/img/monarch-ui-icon_DISEASE.png'),
  'noncausal-disease': require('../assets/img/monarch-ui-icon_DISEASE.png'),
  function: require('../assets/img/monarch-ui-icon_FUNCTION.png'),
  gene: require('../assets/img/monarch-ui-icon_GENE.png'),
  'causal-gene': require('../assets/img/monarch-ui-icon_GENE.png'),
  'noncausal-gene': require('../assets/img/monarch-ui-icon_GENE.png'),
  genotype: require('../assets/img/monarch-ui-icon_GENOTYPE.png'),
  case: require('../assets/img/monarch-ui-icon_DISEASE.png'),
  homolog: require('../assets/img/monarch-ui-icon_HOMOLOG.png'),
  interaction: require('../assets/img/monarch-ui-icon_INTERACTIONS.png'),
  publication: require('../assets/img/monarch-ui-icon_PUBLICATION.png'),
  model: require('../assets/img/monarch-ui-icon_MODEL.png'),
  'ortholog-disease': require('../assets/img/monarch-ui-icon_ORTHOLOG_DISEASE.png'),
  'ortholog-phenotype': require('../assets/img/monarch-ui-icon_ORTHOLOG_PHENOTYPE.png'),
  pathway: require('../assets/img/monarch-ui-icon_PATHWAYS.png'),
  phenotype: require('../assets/img/monarch-ui-icon_PHENOTYPE.png'),
  variant: require('../assets/img/monarch-ui-icon_VARIANT.png')
};

const labels = {
  anatomy: 'Anatomy',
  cellline: 'Cell Line',
  disease: 'Disease',
  'causal-disease': 'Disease (causal)',
  'noncausal-disease': 'Disease (noncausal)',
  function: 'Function',
  gene: 'Gene',
  'causal-gene': 'Gene (causal)',
  'noncausal-gene': 'Gene (noncausal)',
  genotype: 'Genotype',
  case: 'Case',
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
    'reactome-viewer': ReactomeViewer,
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
      references: [],
      inheritance: null,
      modifiers: null,
      contentScript: '',
      contentBody: '',
      path: null,
      icons,
      labels,
      nodeId: null,
      nodeType: null,
      nodeIcon: null,
      nodeCategory: null,
      originalId: null,
      isGroup: false,
      availableCards: availableCardTypes,
      nonEmptyCards: [],
      expandedCard: null,
      hasGeneExac: false,
      entrezResult: null,
      reactomeId: null,
      isRedirected: false,

      counts: {
        disease: 0,
        phenotype: 0,
        gene: 0,
        variant: 0,
        model: 0,
        pathway: 0,
        publication: 0,
        cellline: 0,
        genotype: 0,
        case: 0
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
      ],
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

      if (to.path !== this.path && !this.isRedirected) {
        this.fetchData();
        this.originalId = null;
        this.isRedirected = false;
      } else {
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
    if (this.$refs.titleBar) {
      if (this.$refs.titleBar.scrollHeight > 60) {
        this.$refs.titleBar.style.fontSize = '1.1rem';
      } else {
        this.$refs.titleBar.style.fontSize = '';
      }
    }
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

    buildFacets() {
      if (!this.node.association_counts) {
        console.log('Missing association_counts', this.node);
      } else {
        const associationCountsByCardType = this.node.association_counts;

        const taxonTotals = {};
        const selectedTaxons = {};
        Object.keys(associationCountsByCardType).forEach((cardType) => {
          const associationCounts = associationCountsByCardType[cardType];
          const count = (associationCounts && associationCounts.counts) || 0;
          const countsByTaxon = (associationCounts && associationCounts.counts_by_taxon) || {};

          if (countsByTaxon) {
            Object.keys(countsByTaxon).forEach((taxon) => {
              selectedTaxons[taxon] = true;
              const taxonCount = taxonTotals[taxon] || 0;
              taxonTotals[taxon] = taxonCount + countsByTaxon[taxon];
            });
          }
        });

        this.facetObject.taxons = taxonTotals;
        this.facetObject.selectedTaxons = selectedTaxons;
        this.updateCounts();
      }
    },

    updateCounts() {
      const nonEmptyCards = [];
      if (!this.node.association_counts) {
        console.log('Missing association_counts', this.node);
      } else {
        const associationCountsByCardType = this.node.association_counts;
        // console.log(JSON.stringify(Object.keys(associationCountsByCardType), null, 2));

        this.availableCards.forEach((cardType) => {

          const associationCounts = associationCountsByCardType[cardType];
          const count = (associationCounts && associationCounts.counts) || 0;
          const countsByTaxon = (associationCounts && associationCounts.counts_by_taxon) || {};
          const taxonTotal = count;
          let taxonFiltered = count;

          if (countsByTaxon) {
            Object.keys(countsByTaxon).forEach((t) => {
              if (!this.facetObject.selectedTaxons[t]) {
                taxonFiltered -= countsByTaxon[t];
              }
            });
          }

          this.counts[cardType] = taxonFiltered;
          if (count > 0) {
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
      this.references = [];
      this.modifiers = null;
      this.reactomeId = null;

      const nodeSummaryPromise = biolinkService.getNode(this.nodeId, this.nodeType);
      const neighborhoodPromise = biolinkService.getNeighborhood(this.nodeId, this.nodeType);

      const [node, neighborhood] = await Promise.all(
        [
          nodeSummaryPromise,
          neighborhoodPromise
        ]
      );

      // Redirect if biolink is returning a different ID than the
      // one we provided
      if (this.nodeId !== node.id) {
        this.isRedirected = true;
        this.originalId = this.$route.params.id;
        this.nodeId = node.id;
        this.$router.push(node.id);
      }

      this.node = node;
      if (this.node.synonyms) {
        this.synonyms = this.node.synonyms.map(s => s.val);
      } else {
        this.synonyms = [];
      }

      if (!this.node.label) {
        this.node.label = this.node.id;
      }

      if (this.nodeType === 'publication') {
        const entrezResult = await Entrez.getPublication(this.nodeId);

        if (!entrezResult) {
          console.log('Entrez.getPublication null for ', this.nodeId);
        } else {
          this.entrezResult = entrezResult;
          const entrezTitle = htmlDecode(entrezResult.title);
          this.node.label = entrezTitle;
          this.node.uri = entrezResult.pubmedURL;

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
        }
      }

      //
      // Because Monarch doesn't ingest gene descriptions, we must
      // asynchronously pull these from MyGene. In the future, BioLink
      // may provide this data, either by ingest or by making the MyGene
      // call from the BioLink server.
      //

      if (this.nodeType === 'gene' || this.nodeType === 'variant') {
        const geneInfo = await MyGene.getGeneDescription(this.node.id);
        const hit = geneInfo && geneInfo.hits[0];
        if (hit) {
          if (node.description) {
            console.log('Overriding node.description with hit.summary', node.description, hit.summary);
          }

          node.description = hit.summary;

          node.geneInfo = geneInfo;
          if (this.synonyms.indexOf(hit.name) !== -1) {
            this.synonyms.unshift(hit.name);
          }
        }
      } else if (this.nodeType === 'case') {
        node.description = this.getCaseDescription();
      }

      const reactomePrefix = 'REACT:';
      if (this.nodeType === 'pathway' && this.node.id.indexOf(reactomePrefix) === 0) {
        this.reactomeId = this.node.id.slice(reactomePrefix.length);
      }

      //
      // If there a taxon for the current node, then build
      // a nice URL
      //
      const ncbiTaxonPrefix = 'NCBITaxon:';
      if (
        this.node.taxon
        && this.node.taxon.id
        && this.node.taxon.id.indexOf(ncbiTaxonPrefix) === 0
      ) {
        const taxonNumber = this.node.taxon.id.slice(ncbiTaxonPrefix.length);
        this.node.taxon.uri = `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=${taxonNumber}`;
      }

      //
      // Build out the superclass/subclass/equivclass lists from
      // the info provided by getNeighborhood()
      //
      const nodeLabelMap = neighborhood.nodeLabelMap;
      /* const equivalentClasses = neighborhood.equivalentClasses;
      //this.equivalentClasses = us.map(us.uniq(equivalentClasses), c => ({
      //  id: c,
      //  label: nodeLabelMap[c]
      })); */
      const superclasses = neighborhood.superclasses;
      const subclasses = neighborhood.subclasses;
      const xrefs = neighborhood.xrefs;
      this.superclasses = us.map(us.uniq(superclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      this.subclasses = us.map(us.uniq(subclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));

      this.isGroup = this.subclasses.length > 0;

      // To get xref link outs, we use the xref map in
      // lib/conf/xref.js, additional prefixes are added
      // by looking at the is_defined_by field in solr

      let sources = Object.keys(this.node.association_counts.sources);
      sources = processSources(sources);
      // Add the curie prefix for the node we're on
      sources = new Set([this.nodeId.split(':')[0].toLowerCase()].concat(sources));
      // IMPC only has gene and phenotype pages
      if (
        sources.has('impc')
        && this.nodeType !== 'phenotype'
        && this.nodeType !== 'gene'
      ) {
        sources.delete('impc');
      }

      const seenCache = new Set([]);
      const urlCache = new Set([]);
      xrefs.forEach((xref) => {
        let hasRef = false;
        sources.forEach((source) => {
          const url = getXrefUrl(source, xref, this.node.label.split(' ')[0]);
          if (url) {
            hasRef = true;
            if (seenCache.has(xref)) {
              const xrefId = xref.split(':')[1];
              xref = `${source.toUpperCase()}:${xrefId}`;
            } else {
              seenCache.add(xref);
            }
            if (!urlCache.has(url)) {
              this.references.push({
                label: xref,
                uri: url
              });
              urlCache.add(url);
            }
          }
        });
        if (!hasRef) {
          this.references.push({
            label: xref,
            uri: null
          });
        }
      });

      // We have a deal with VarSome for mutual linking, this should
      // be in some configuration file or directly in our database
      // eg https://varsome.com/gene/HGNC:1100
      if (this.nodeId.startsWith('HGNC')) {
        this.references.push({
          label: 'Varsome',
          uri: `https://varsome.com/gene/${this.nodeId}`
        });
      }

      if (this.node.inheritance) {
        this.inheritance = us.uniq(
          this.node.inheritance.map(i => i.label)
        ).join(', ');
      }
      if (this.node.clinical_modifiers) {
        this.modifiers = us.uniq(
          this.node.clinical_modifiers.map(m => m.label)
        ).join(', ');
      }

      this.nodeCategory = this.node.categories
        ? this.node.categories[0].toLowerCase()
        : this.nodeType;
      this.nodeIcon = this.icons[this.nodeCategory];
      this.hasGeneExac = (this.nodeType === 'gene' || this.nodeType === 'variant');

      this.buildFacets();

      //
      // If we got here via someone specifying a cardType in the
      // URL hash, then expand that cardType.
      //
      const hash = this.$router.currentRoute.hash;
      if (hash.length > 1) {
        const cardType = hash.split('?')[0].slice(1);
        this.$nextTick(() => {
          this.expandCard(cardType);
        });
      }
    },
    getCaseDescription() {
      return `
    <div class="text">
      The NIH Undiagnosed Disease Program (UDP) was started in 2008.
      The program’s goals include making diagnosis and conducting research for individuals
      and families with illnesses that remain undiagnosed despite an extensive medical
      workup. In 2013, the program expanded to the Undiagnosed Diseases Network (UDN).
      The UDN performs similar work, but now includes a number of clinical and research
      sites across the United States. Persons interested in learning more about the UDN,
      are invited to visit the UDN website:<br>
      <a href="https://undiagnosed.hms.harvard.edu/">
        https://undiagnosed.hms.harvard.edu/
      </a>
    </div>

    <div class="text" style="padding-top:10px">
      This case includes information from a participant in the Undiagnosed Diseases Program
      (UDP) at the National Institutes of Health. For protection of participant privacy,
      the case description does not include identifiable information.
      Features of the participant’s medical condition are presented, along with genes of potential
      interest. In addition, we provide similarity scores to diseases, other cases, and non-human models
      based on phenotype profile comparisons computed by OwlSim.
      If you are a researcher studying a listed gene or clinical feature, or if you have a
      family member with a similar illness, please consider contacting the UDP. Contacting
      the UDP will allow a discussion about options for collaboration and/or study participation.
      Inquiries should be sent to David Adams, MD, PhD at david.adams[at]nih.gov.
      Some UDN families and individuals have elected to post more extensive information on the web.
      Those pages can be viewed at the following website:<br>
      <a href="https://undiagnosed.hms.harvard.edu/updates/participant-pages/">
        https://undiagnosed.hms.harvard.edu/updates/participant-pages/
      </a>
    </div>
       `;
    }
  }
};

</script>

<style lang="scss">
@import "~@/style/variables";

$sidebar-content-width: 500px;
$sidebar-button-width: 32px;
$title-bar-max-height: 60px;
$line-height-compact: 1.3em;


.node-wrapper {
  min-height: 100%;
}

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
  margin-top: ($title-bar-max-height + 15);
  transition: all 0.3s;
  width: 100%;
  height: 100%;

  .expanded-card-view {
    padding:0;
  }
}

.node-container .node-description {
  margin: 10px 0;
  padding: 0;
  line-height: $line-height-compact;

  .description {
    margin-top: 5px;
  }
}

.wrapper {
  display: flex;
  align-items: stretch;
  min-height: 100%;
  width: 100%;
  margin: 0;
}


div.container-cards {
  width: unset;
  padding: 0;
  margin: 0 0 0 $sidebar-width;

  .loading {
    margin: 15% calc(50% - 14%);
    text-align: center;
  }

  & .node-content-section {
    line-height: $line-height-compact;
  }

  & .node-cards-section {
    margin-top: 50px;
  }
}

.title-bar {
  border-bottom: 1px solid lightgray;
  background: #1b5f75;
  color: white;
  position: fixed;
  height: $title-bar-max-height;
  overflow-y: hidden;
  line-height: $line-height-compact;
  top: ($navbar-height);
  left: 0;
  right: 222px;
  margin: 0 0 0 $sidebar-width;
  width: 100%;
  z-index: 1;
  font-size: 1.5rem;
  padding: 5px 15% 5px 5px;

  & .synonym {
    padding: 0 2px;
    margin: 0 15px 0 0;
    font-size: 0.9em;
    font-weight: 500;
  }

  & .node-label {
    margin: 2px;
  }
  & .node-label-label {
    margin: 0;
    padding-left: 15px;
    padding-top: 15px;
    font-size: inherit;

    & .node-label-id {
      font-size: .8rem;
      color: #a9a9a9a1;
    }
  }
}

.node-synonyms {
  line-height: 1.0em;
  margin: 5px 0;
  padding: 0 10px;

  & ul {
    list-style: none;
  }
}

div.publication-abstract {
  margin: 0;
}

@media (max-width: $sidebar-collapse-width) {
  div.container-cards {
    margin-left: $collapsed-sidebar-width;
  }

  .title-bar {
    padding-left: ($collapsed-sidebar-width + 5);
  }
}

.reference-external {
  white-space: nowrap;
}

</style>

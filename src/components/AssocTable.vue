<template>
  <div
    class="assoc-table">
    <div v-show="dataFetched">
      <!--
      <h5>
        <strong>{{ totalItems }}</strong>&nbsp;
        <strong>{{ cardType }}</strong> associations
      </h5>
      -->

      <b-table
        ref="tableRef"
        :items="rowsProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        responsive="true"
        class="table-sm"
      >

        <template
          v-if="isGene"
          slot="taxon"
          slot-scope="data"
        >
          <i>{{ data.item.taxonLabel }}</i>
        </template>

        <template
          slot="assocObject"
          slot-scope="data"
        >
          <template
            v-if="data.item.objectLink">
            <strong>
              <router-link
                :to="data.item.objectLink">
                {{ data.item.assocObject }}
              </router-link>
            </strong>
          </template>
          <template
            v-else>
            <strong>
              {{ data.item.assocObject }}
            </strong>
          </template>
        </template>

        <template
          slot="relation"
          slot-scope="data"
        >
          <small>
            <a
              :href="data.item.relation.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ data.item.relation.label }}
            </a>
          </small>
        </template>

        <template
          slot="assocSubject"
          slot-scope="data"
        >
          <template
            v-if="data.item.subjectLink">
            <strong>
              <router-link :to="data.item.subjectLink">
                {{ data.item.assocSubject }}
              </router-link>
            </strong>
          </template>
          <template
            v-else>
            <strong>
              {{ data.item.assocSubject }}
            </strong>
          </template>
        </template>

        <template
          slot="support"
          slot-scope="data"
        >
          <b-button
            :pressed.sync="data.item._showDetails"
            size="small"
            class="btn btn-xs px-1 py-0 m-0"
            variant="outline-info">
            <span
              v-for="(icon, index) in data.item.supportIcons"
              :key="index"
            >
              <i
                :class="icon"
                class="fa fa-fw"
              />
            </span>
            <small>{{ data.item.supportLength }}</small>
          </b-button>
        </template>

        <template
          slot="row-details"
          slot-scope="row"
        >
          <div class="container-fluid support-section py-0">
            <div
              v-for="(support, index) in row.item.support"
              :key="index"
              class="row"
            >
              <div
                class="col-9 px-1">
                <a
                  v-if="support.label"
                  :href="support.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ support.label }}&nbsp;
                  <img
                    v-if="support.icon"
                    :src="support.icon"
                    class="source-icon">
                </a>
              </div>
              <div
                class="col-2 px-1">
                <small>{{ support.type }}</small>
              </div>
              <div
                class="col-1 px-1"
                style="text-align: center;">
                <i
                  :class="support.typeIcon"
                  class="fa fa-fw text-info"
                />
              </div>
            </div>
          </div>
        </template>
      </b-table>
      <div v-if="totalItems > rowsPerPage">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="totalItems"
          class="pag-width my-1"
          align="center"
          size="md"
        />
      </div>
    </div>
    <div v-if="dataError">
      <h3>BioLink Error</h3>
      <div class="row">
        <div class="col-xs-12 pre-scrollable">
          <json-tree
            :data="dataError.response"
            :level="1"
          />
        </div>
      </div>
    </div>
    <div v-show="!dataFetched && !dataError">
      <br>
      <br>
      <h5>Loading…</h5>
    </div>
  </div>
</template>

<script>
import * as BL from '@/api/BioLink';
import JsonTree from 'vue-json-tree';
import sourceToImage from '../lib/sources';

export default {
  components: {
    'json-tree': JsonTree
  },
  props: {
    nodeId: {
      type: String,
      required: true
    },
    cardType: {
      type: String,
      required: true
    },
    nodeType: {
      type: String,
      required: true
    },
    facets: {
      type: Object,
      default: null,
      required: false
    }
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 25,
      totalItems: 0,
      isGene: false,
      associationData: '',
      dataFetched: false,
      dataError: false,
      dataFetchedPage: 0,
      dataFetchedRowsPerPage: 0,
      fields: [],
      rows: [],
      taxonFields: [
        'gene',
        'genotype',
        'model',
        'variant',
        'homolog'
      ],
      lastSelection: [],
    };
  },
  computed: {
    trueFacets() {
      const truth = [];
      Object.entries(this.facets.species)
        .forEach((elem) => {
          if (elem[1]) {
            truth.push(this.keyMap(elem[0]));
          }
        });
      return truth;
    }
  },
  watch: {
    cardType() {
      this.dataFetched = false;
      this.dataError = false;
      window.scroll(0, 0);
      this.currentPage = 1;
      this.generateFields();

      this.$refs.tableRef.refresh();
    },
    facets: {
      handler() {
        this.currentPage = 1;
        this.$refs.tableRef.refresh();
      },
      deep: true
    }
  },
  mounted() {
    this.generateFields();
  },
  methods: {
    async rowsProvider(ctx, callback) {
      this.fetchData().then(() => {
        callback(this.rows);
      }).catch((error) => {
        callback([]);
      });
    },

    keyMap(key) {
      const keyMappings = {
        'Skeletal system': 'HP:0000924',
        'Limbs': 'HP:0040064',
        'Nervous system': 'HP:0000707',
        'Head or neck': 'HP:0000152',
        'Metabolism/homeostasis': 'HP:0001939',
        'Cardiovascular system': 'HP:0001626',
        'Integument': 'HP:0001574',
        'Genitourinary system': 'HP:0000119',
        'Eye': 'HP:0000478',
        'Musculature': 'HP:0003011',
        'Neoplasm': 'HP:0002664',
        'Digestive system': 'HP:0025031',
        'Immune System': 'HP:0002715',
        'Blood and blood-forming tissues': 'HP:0001871',
        'Endocrine': 'HP:0000818',
        'Respiratory system': 'HP:0002086',
        'Ear': 'HP:0000598',
        'Connective tissue': 'HP:0003549',
        'Prenatal development or birth': 'HP:0001197',
        'Growth': 'HP:0001507',
        'Constitutional': 'HP:0025142',
        'Thoracic cavity': 'HP:0045027',
        'Breast': 'HP:0000769',
        'Voice': 'HP:0001608',
        'Cellular': 'HP:0025354',
        'Anolis carolinensis': 'NCBITaxon:28377',
        'Arabidopsis thaliana': 'NCBITaxon:3702',
        'Bos taurus': 'NCBITaxon:9913',
        'Caenorhabditis': 'NCBITaxon:6237',
        'Caenorhabditis elegans': 'NCBITaxon:6239',
        'Danio rerio': 'NCBITaxon:7955',
        'Drosophila melanogaster': 'NCBITaxon:7227',
        'Equus caballus': 'NCBITaxon:9796',
        'Gallus gallus': 'NCBITaxon:9031',
        'Homo sapiens': 'NCBITaxon:9606',
        'Macaca mulatta': 'NCBITaxon:9544',
        'Mammalia': 'NCBITaxon:40674',
        'Monodelphis domestica': 'NCBITaxon:13616',
        'Mus musculus': 'NCBITaxon:10090',
        'Ornithorhynchus anatinus': 'NCBITaxon:9258',
        'Pan troglodytes': 'NCBITaxon:9598',
        'Rattus norvegicus': 'NCBITaxon:10116',
        'Saccharomyces cerevisiae': 'NCBITaxon:4932',
        'Saccharomyces cerevisiae S288C': 'NCBITaxon:559292',
        'Sus scrofa': 'NCBITaxon:9823',
        'Xenopus (Silurana) tropicalis': 'NCBITaxon:8364'
      };
      return keyMappings[key];
    },

    async fetchData() {
      const that = this;
      if (that.dataFetchedPage === that.currentPage
           && that.dataFetchedRowsPerPage === that.rowsPerPage) {
        // console.log('####fetchData inhibited due to cached values.');
      }
      else {
        try {
          const params = {
            fetch_objects: true,
            start: ((this.currentPage - 1) * this.rowsPerPage),
            rows: this.rowsPerPage
          };
          const associationsResponse = await BL.getNodeAssociations(
            this.nodeType,
            this.nodeId,
            this.cardType,
            params
          );
          // console.log('associationsResponse');
          // console.log(JSON.stringify(associationsResponse, null, 2));

          if (!associationsResponse.data
              || !associationsResponse.data.associations) {
            that.associationData = null;
            throw new Error('BL.getNodeAssociations() returned no data');
          }
          that.associationData = associationsResponse.data;
          that.dataFetched = true;
          that.dataFetchedPage = this.currentPage;
          that.dataFetchedRowsPerPage = this.currentPage;

          that.totalItems = associationsResponse.data.numFound;
          // associationsResponse.data.associations.forEach(a => {
          //   console.log(a.subject.label, a.subject.taxon.label);
          // });
          // that.currentPage = 1;
          that.populateRows();
        }
        catch (e) {
          that.dataError = e;
          console.log('BioLink Error', e);
        }
      }
    },

    fixupRelation(elem, nodeType, cardType) {
      const relation = elem.relation;
      if (!relation) {
        console.log('fixupRelation NO RELATION');
        console.log(JSON.stringify(elem, null, 2));
        elem.relation = {
          label: 'Unknown',
          id: 'RO:Unknown',
        };
      }
      else {
        if (!relation.label && relation.id) {
          relation.label = relation.id;
        }
        else if (!relation.label) {
          relation.label = 'Unknown';
          relation.id = 'RO:Unknown';
        }
        relation.label = relation.label.replace(/_/g, ' ');
        if (relation.id === 'RO:0002200') {
          if (nodeType !== 'phenotype' && cardType !== 'genotype') {
            relation.id = 'RO:0002201';
            relation.label = 'phenotype of';
          }
        }
        else if (relation.id === 'RO:0003301') {
          if (nodeType !== 'model') {
            relation.id = 'RO:0002615';
            relation.label = 'model of';
          }
        }
        else if (relation.id === 'RO:0002206') {
          if (nodeType === 'gene' && cardType === 'anatomy') {
            relation.id = 'RO:0002292';
            relation.label = 'expresses';
          }
        }
      }
    },

    populateRows() {
      this.rows = [];
      let count = 0;
      this.associationData.associations.forEach((elem) => {
        count += 1;
        let pubs = [
        ];
        let pubsLength = 0;
        if (elem.publications) {
          pubs = this.parsePublications(elem.publications);
          pubsLength += pubs.length;
        }
        let evidence = [
        ];
        let evidenceLength = 0;
        const eviResults = this.parseEvidence(elem.evidence_graph);
        if (eviResults.length) {
          evidence = eviResults;
          evidenceLength = eviResults.length;
        }
        const objectElem = elem.object;
        const subjectElem = elem.subject;
        const taxon = this.parseTaxon(objectElem);

        const support = [];
        const supportIcons = [];

        if (evidence.length > 0) {
          const eviIcon = 'fa-flask'; // 'fa-legal' 'fa-chain';
          supportIcons.push(eviIcon);
          evidence.forEach((evi) => {
            support.push({
              type: 'evidence',
              typeIcon: eviIcon,
              label: `${evi.lbl} (${evi.id})`,
              url: this.eviHref(evi),
            });
          });
        }

        if (pubs.length > 0) {
          const pubIcon = 'fa-book';
          supportIcons.push(pubIcon);
          pubs.forEach((pub) => {
            support.push({
              type: 'publication',
              typeIcon: pubIcon,
              label: pub,
              url: this.pubHref(pub),
            });
          });
        }

        const sources = elem.provided_by;
        if (sources.length > 0) {
          const sourceIcon = 'fa-database';
          supportIcons.push(sourceIcon);
          elem.provided_by.forEach((source) => {
            support.push({
              type: 'source',
              label: this.sourceLabel(source),
              typeIcon: sourceIcon,
              icon: '../img/sources/' + sourceToImage(source),
            });
          });
        }

        const supportLength = support.length;
        // console.log('support');
        // console.log(JSON.stringify(support, null, 2));
        if (!taxon.id || this.trueFacets.includes(taxon.id)) {
          const simplifiedCardType = this.cardType.replace(/ortholog-/g, '');
          let objectLink = `/${simplifiedCardType}/${objectElem.id}`;
          if (objectElem.id.indexOf(':.well-known') === 0) {
            objectLink = null;
          }
          const subjectLink = `/${this.nodeType}/${subjectElem.id}`;

          this.fixupRelation(elem, this.nodeType, this.cardType);

          this.rows.push({
            publications: pubs,
            publicationsLength: pubsLength,
            annotationType: this.cardType,
            evidence,
            evidenceLength,
            support,
            supportLength,
            supportIcons,
            objectCurie: objectElem.id,
            sources: elem.provided_by,
            sourcesLength: elem.provided_by.length,
            assocObject: objectElem.label,
            objectLink,
            assocSubject: subjectElem.label,
            subjectLink,
            taxonLabel: taxon.label,
            taxonId: taxon.id,
            relation: elem.relation,
            _showDetails: false,
          });

          elem.relation.url = this.relationHref(elem.relation);
        }
      });
    },
    generateFields() {
      this.isGene = false;

      const fields = [
        {
          key: 'assocObject',
          label: this.firstCap(this.cardType),
          class: 'assoc-object',
          // sortable: true,
        },
        {
          key: 'relation',
          label: 'Relation',
          class: 'relation-column-width',
          // sortable: true,
        },
        {
          key: 'assocSubject',
          label: this.firstCap(this.nodeType),
          class: 'assoc-subject',
          // sortable: true,
        },
        {
          key: 'support',
          class: 'support-column-width',
          label: 'Support',
        },
      ];

      if (this.taxonFields.includes(this.cardType)) {
        this.isGene = true;
        fields.splice(0, 0, {
          key: 'taxon',
          label: 'Species'
          // sortable: true,
        });
      }
      this.fields = fields;
    },
    parseEvidence(evidenceGraph) {
      let result = [];
      if (evidenceGraph.nodes) {
        result = evidenceGraph.nodes.filter(elem => elem.id.includes('ECO'));
      }
      return result;
    },
    parsePublications(pubsList) {
      const pubs = [];
      pubsList.forEach((elem) => {
        if (elem.id !== this.nodeId) {
          pubs.push(elem.id);
        }
      });
      return pubs;
    },
    parseTaxon(elemObj) {
      const taxon = {
        label: '',
        id: ''
      };
      if ('taxon' in elemObj) {
        taxon.label = elemObj.taxon.label;
        taxon.id = elemObj.taxon.id;
      }
      return taxon;
    },
    firstCap(val) {
      return val.charAt(0)
        .toUpperCase() + val.slice(1);
    },

    pubHref(curie) {
      const identifier = curie.split(/[:]+/).pop();
      return `https://www.ncbi.nlm.nih.gov/pubmed/${identifier}`;
    },
    eviHref(evi) {
      const curie = evi.id || '';
      const identifier = curie.split(/[:]+/).pop();
      return `http://purl.obolibrary.org/obo/ECO_${identifier}`;
    },
    relationHref(relation) {
      const curie = relation.id || '';
      const identifier = curie.split(/[:]+/).pop();
      return `http://purl.obolibrary.org/obo/RO_${identifier}`;
    },
    sourceLabel(url) {
      const result = url.split(/[/]+/)
        .pop()
        .split(/[.]+/)[0]
        .toUpperCase();
      return result;
    }
  }
};
</script>

<style lang="scss">
@import "~@/style/variables";
.assoc-table {
  .table.b-table tr {
    outline: 1px solid lightgray;
  }

  table.b-table.b-table-selectable > tbody > tr
  {
    /*
     * Inhibit b-table's default user-select:none; which
     * was preventing user copying to clipboard.
     */
    -webkit-user-select: unset;
    -moz-user-select: unset;
    -ms-user-select: unset;
    user-select: unset;
    cursor: unset;
  }

  .assoc-object,
  .assoc-subject {
    min-width: 200px;
    word-break: break-all;
  }

  table.b-table row.b-table-details
  {
  }
  a {
    color: #404040;
  }

  .main-font {
    color: #404040;
  }

  .align-left {
    text-align: left;
  }

  .align-right {
    text-align: right;
  }

  .table-border-soft {
    border: solid lightgrey 1px;
    border-radius: 10px;

  }

  .relation-column-width {
    min-width: 100px !important;
  }

  .support-column-width {
    min-width: 100px !important;
  }

  .support-is-active {
    background: lightblue;
  }

  .support-section {
    max-height: 200px;
    overflow-y: auto;
  }

  .list-bullets {
    list-style: square;
    padding: 0;
    margin: 0;
    list-style-position: inside;
  }

  a.page-link {
    color: #404040;
  }
  .full-width {
    width: 100%;
  }
  .table thead th {
    border-top: none;
  }

  .btn-toggle {
    margin: 0;
    padding: 0;
    height: 25px;
    background: none;
    border: none;
    border-left: 2px solid lightgray;
  }

  img.source-icon {
    margin: 0;
    padding: 0;
    vertical-align: top;
    max-height: 22px;
    height: 22px;
    width: auto;
  }

  .object-label {
    word-break: break-all;
  }
}
</style>

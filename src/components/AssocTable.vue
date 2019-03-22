<template>
  <div
    class="assoc-table">
    <div v-show="dataFetched">
      <h5>
        <strong>{{ totalItems }}</strong>&nbsp;
        <strong>{{ nodeType }}</strong> to
        <strong>{{ cardType }}</strong> associations
      </h5>


      <b-table
        ref="tableRef"
        :items="rowsProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        responsive="true"
        hover
        selectable
        select-mode="range"
        selected-variant="info"
        class="table-sm"
        @row-selected="rowSelected"
      >

        <template
          slot="assocObject"
          slot-scope="data"
        >
          <template
            v-if="data.item.objectLink">
            <strong>
              <router-link :to="data.item.objectLink">
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
          <a
            :href="data.item.relation.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ data.item.relation.label }}
          </a>
        </template>

        <template
          v-if="isGene"
          slot="taxon"
          slot-scope="data"
        >
          {{ data.item.taxonLabel }}
        </template>

        <template
          slot="evidence"
          slot-scope="data"
        >
          ({{ data.item.evidenceLength }})
        </template>

        <template
          slot="publications"
          slot-scope="data"
        >
          ({{ data.item.publicationsLength }})
        </template>

        <template
          slot="sources"
          slot-scope="data"
        >
          ({{ data.item.sourcesLength }})
        </template>

        <template
          slot="support"
          slot-scope="data"
        >
          <span
            v-for="(icon, index) in data.item.supportIcons"
            :key="index"
          >
            <i
              :class="icon"
              class="fa fa-fw"
            />
          </span>
          ({{ data.item.supportLength }})
        </template>

        <template
          slot="row-details"
          slot-scope="row"
        >
          <div class="xcard ml-1 xborder xborder-secondary">
            <div
              v-for="(support, index) in row.item.support"
              :key="index"
              class="row"
            >
              <div
                class="col-2">
                <i
                  :class="support.typeIcon"
                  class="fa fa-fw"
                />
                <small>&nbsp;{{ support.type }}</small>
              </div>
              <div
                v-if="support.label"
                class="col-10">
                <a
                  :href="support.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ support.label }}
                </a>
              </div>
              <div
                v-if="support.icon"
                class="col-9">
                <img
                  :src="support.icon"
                  class="source-icon">
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
  filters: {
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
      inverted: false,
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
      lastSelection: null,
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

    rowSelected(rows, index, event) {
      if (this.lastSelection) {
        this.lastSelection.forEach((r) => {
          this.$set(r, '_showDetails', false);
        });
      }
      rows.forEach((r) => {
        this.$set(r, '_showDetails', true);
      });
      this.lastSelection = rows.slice(0);
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
        let objectElem = elem.object;
        if (this.inverted) {
          objectElem = elem.subject;
        }
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
              url: this.$options.filters.eviHref(evi),
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
              url: this.$options.filters.pubHref(pub),
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
              // label: this.$options.filters.sourceLabel(source),
              typeIcon: sourceIcon,
              icon: '../img/sources/' + sourceToImage(source),
            });
          });
        }

        const supportLength = support.length;
        // console.log('support');
        // console.log(JSON.stringify(support, null, 2));
        if (!taxon.id || this.trueFacets.includes(taxon.id)) {
          let objectLink = `/${this.cardType}/${objectElem.id}`;
          if (objectElem.id.indexOf(':.well-known') === 0) {
            objectLink = null;
          }

          // if (this.rows.length === 0) {
          //   console.log('firstrow');
          //   console.log(JSON.stringify(elem, null, 2));
          //   console.log('firstrow evidence', evidenceLength);
          //   console.log(JSON.stringify(evidence, null, 2));
          // }
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
            taxonLabel: taxon.label,
            taxonId: taxon.id,
            relation: elem.relation,
            _showDetails: false,
            isActive: false,
          });

          elem.relation.url = this.$options.filters.relationHref(elem.relation);
        }
      });
    },
    generateFields() {
      this.isGene = false;
      const fields = [
        // {
        //   key: 'show_details',
        //   label: ''
        // },
        {
          key: 'assocObject',
          label: this.firstCap(this.cardType),
          'class': 'assoc-column-width '
          // sortable: true,
        },
        {
          key: 'relation',
          label: 'Relation'
        },
        {
          key: 'evidence',
          label: 'Evidence'
        },
        {
          key: 'publications',
          label: 'Publications'
        },
        {
          key: 'sources',
          label: 'Sources'
        },
        {
          key: 'support',
          label: 'Support'
        }
      ];
      const fieldsWithSupport = [
        {
          key: 'assocObject',
          label: this.firstCap(this.cardType),
          'class': 'assoc-column-width '
          // sortable: true,
        },
        {
          key: 'relation',
          label: 'Relation'
        },
        {
          key: 'support',
          label: 'Support'
        }
      ];

      if (this.taxonFields.includes(this.cardType)) {
        this.isGene = true;
        fields.splice(2, 0, {
          key: 'taxon',
          label: 'Taxon'
          // sortable: true,
        });
        fieldsWithSupport.splice(2, 0, {
          key: 'taxon',
          label: 'Taxon'
          // sortable: true,
        });
      }
      this.fields = fieldsWithSupport;
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
  .assoc-column-width {
    width: 400px;
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
    max-height: 22px;
    height: 22px;
    width: auto;
  }
}
</style>

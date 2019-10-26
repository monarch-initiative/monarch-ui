<template>
  <div class="assoc-table">
    <div v-if="dataError" class="border p-2 m-2">
      <h3>BioLink Error</h3>
      <div class="col-xs-12">
        {{ dataError }}
      </div>
    </div>

    <div v-show="!dataFetched && !dataError" class="loading-div">

      <b-spinner class="loading-spinner" type="grow" label="Spinning"/>
    </div>

    <div v-show="dataFetched && !dataError">

      <h5>
        &nbsp;<strong>{{ totalAssociations }}</strong>&nbsp;
        <strong>{{ cardType.replace('-', ' ') }}</strong> associations.
      </h5>

      <b-table
        ref="tableRef"
        :items="rowsProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        responsive="true"
        class="table-sm"
      >
        <template v-slot:taxon="data" v-if="hasTaxon">
          <i>{{ data.item.taxonLabel }}</i>
        </template>

        <template v-slot:assocObject="data">
          <template v-if="data.item.objectLink">
            <strong>
              <router-link :to="data.item.objectLink" v-html="$sanitizeText(data.item.assocObject)"/>
            </strong>
          </template>
          <template v-else>
            <strong>
              {{ data.item.assocObject }}
            </strong>
          </template>
        </template>

        <template v-slot:relation="data">
          <small>
            <a
              :href="data.item.relation.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span v-if="data.item.relation.inverse">
                <b>&Larr;</b>
              </span>
              {{ data.item.relation.label }}
              <span v-if="data.item.relation.inverse">
                <b>&Larr;</b>
              </span>
            </a>
          </small>
        </template>

        <template v-slot:assocSubject="data" v-if="isGroup">
          <template v-if="data.item.subjectLink">
            <strong>
              <router-link :to="data.item.subjectLink" v-html="$sanitizeText(data.item.assocSubject)">
                {{ data.item.assocSubject }}
              </router-link>
            </strong>
          </template>
          <template v-else>
            <strong>
              {{ data.item.assocSubject }}
            </strong>
          </template>
        </template>

        <template v-slot:frequency="data" v-if="hasFrequencyOnset">
          <a
            v-if="data.item.frequency"
            :href="data.item.frequency.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>
              {{ data.item.frequency.label }}
            </small>
          </a>
        </template>

        <template v-slot:onset="data" v-if="hasFrequencyOnset">
          <a
            v-if="data.item.onset"
            :href="data.item.onset.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>
              {{ data.item.onset.label }}
            </small>
          </a>
        </template>

        <template v-slot:support="data">
          <b-button
            :pressed.sync="data.item._showDetails"
            size="small"
            class="btn btn-xs px-1 py-0 m-0"
            variant="outline-info">
            <span v-if="data.item._showDetails">
              &blacktriangledown;&nbsp;
            </span>
            <span v-else>
              &blacktriangleright;&nbsp;
            </span>

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

        <template v-slot:row-details="row">
          <EvidenceViewer
            :evidence="row.item.evidence"
            :evidence-cache="evidenceCache"
            :node-id="nodeId"
            :node-type="nodeType"
          />
        </template>
      </b-table>
      <div
        v-if="totalAssociations > rowsPerPage">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="totalAssociations"
          class="pag-width my-1"
          align="center"
          size="md"
        />
      </div>
    </div>
  </div>
</template>

<script>
import us from 'underscore';
import * as BL from '@/api/BioLink';
import { processPublications } from '@/lib/Utils';
import sourceToImage from '../lib/sources';
import { isTaxonCardType } from '../lib/TaxonMap';
import EvidenceViewer from '@/components/EvidenceViewer.vue';


function isFrequencyOnsetType(nodeType, cardType) {
  return (nodeType === 'disease' && cardType === 'phenotype') ||
         (nodeType === 'phenotype' && cardType === 'disease');
}


export default {
  components: {
    EvidenceViewer
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
    cardCounts: {
      type: Object,
      required: false,
      default: null,
    },
    facets: {
      type: Object,
      default: null,
      required: false
    },
    isGroup: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 25,
      totalAssociations: 0,
      hasTaxon: false,
      hasFrequencyOnset: false,
      associationData: '',
      dataFetched: false,
      dataError: false,
      dataFetchedPage: 0,
      dataFetchedRowsPerPage: 0,
      fields: [],
      rows: [],
      lastSelection: [],
      evidenceCache: {}
    };
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
    hasFalseFacets() {
      let foundFalseFacets = false;
      Object.entries(this.facets.selectedTaxons)
        .forEach((elem) => {
          if (!elem[1]) {
            foundFalseFacets = true;
          }
        });
      return foundFalseFacets;
    },
    trueFacets() {
      const truth = [];
      Object.entries(this.facets.selectedTaxons)
        .forEach((elem) => {
          if (elem[1]) {
            truth.push(elem[0]);
          }
        });
      return truth;
    },
    allFacets() {
      return Object.entries(this.facets.selectedTaxons).map(elem => elem[0]);
    },

    async rowsProvider(ctx, callback) {
      this.fetchData().then(() => {
        callback(this.rows);
      }).catch((error) => {
        callback([]);
      });
    },

    async fetchData() {
      const that = this;
      if (that.dataFetchedPage === that.currentPage
           && that.dataFetchedRowsPerPage === that.rowsPerPage) {
        console.log('####fetchData inhibited due to cached values.');
      } else {
        this.dataFetched = false;
        this.dataError = false;
        try {
          const params = {
            fetch_objects: true,
            start: ((this.currentPage - 1) * this.rowsPerPage),
            rows: this.rowsPerPage,
            unselect_evidence: true
          };

          const taxons = this.hasFalseFacets() ? this.trueFacets() : null;
          const associationsResponse = await BL.getNodeAssociations(
            this.nodeType,
            this.nodeId,
            this.cardType,
            taxons,
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

          // associationData.associations.forEach(a => {
          //   console.log(a.subject.label, a.subject.taxon.label);
          // });
          // that.currentPage = 1;
          that.populateRows();
        } catch (e) {
          that.dataError = e;
          console.log('BioLink Error', e);
        }
      }
    },

    fixupRelation(elem, nodeType, cardType) {
      const relation = elem.relation;

      /* if (!relation) {
        console.log('fixupRelation NO RELATION');
        console.log(JSON.stringify(elem, null, 2));
        elem.relation = {
          label: 'Unknown',
          id: 'RO:Unknown',
        };
      }else { */

      let inverse = false;
      if (!relation.label && relation.id) {
        relation.label = relation.id;
      } else if (!relation.label) {
        relation.label = '';
        relation.id = '';
      }
      relation.label = relation.label.replace(/_/g, ' ');
      if (relation.id === 'RO:0003301') {
        if (nodeType === 'model') {
          relation.id = 'RO:0002615';
          relation.label = 'has model';
        }
      } else if (relation.id === 'RO:0002615') {
        if (nodeType !== 'model') {
          relation.id = 'RO:0003301';
          relation.label = 'is model of';
        }
      } else if (relation.id === 'RO:0002206') {
        if (nodeType === 'gene' && cardType === 'anatomy') {
          relation.id = 'RO:0002292';
          relation.label = 'expresses';
        }
      } else if (relation.id === 'RO:0002607') {
        if (nodeType === 'gene' && cardType === 'disease') {
          inverse = true;
        }
      } else if (relation.id === 'RO:0003303') {
        if (cardType === 'disease' || cardType === 'phenotype') {
          inverse = true;
        }
      } else if (relation.id === 'RO:0003304') {
        if (cardType === 'disease' || cardType === 'phenotype') {
          inverse = true;
        }
      } else if (relation.id === 'GENO:0000841') {
        if (nodeType === 'gene' && cardType === 'disease') {
          inverse = true;
        }
      } else if (relation.id === 'GENO:0000408') {
        if (nodeType === 'variant' && cardType === 'gene') {
          relation.id = 'GENO:0000413';
          relation.label = 'has allele';
        }
      } else if (relation.id === 'RO:0002331') {
        if (nodeType === 'gene' && cardType === 'pathway') {
          inverse = true;
        }
      } else if (relation.id === 'GENO:0000639') {
        if (nodeType === 'variant' && cardType === 'gene') {
          inverse = true;
        }
        // }
        relation.inverse = inverse;
        // if (inverse) {
        //   relation.label = `&Larr;&nbsp;${relation.label}&nbsp;&Larr;`;
        // }
        // else {
        //   relation.label = `&Rarr;&nbsp;${relation.label}&nbsp;&Rarr;`;
        // }
      }


      // console.log('fixupRelation2', relation.id, relation.label);
    },

    populateRows() {
      this.rows = [];
      let count = 0;
      this.associationData.associations.forEach((elem) => {
        count += 1;

        const objectElem = elem.object;
        const subjectElem = elem.subject;
        let objectTaxon = this.parseTaxon(objectElem);
        // const subjectTaxon = this.parseTaxon(subjectElem);

        const evidence = us.pick(
          elem, ['id', 'provided_by', 'publications', 'evidence_types']
        );

        evidence.publications = processPublications(evidence.publications);

        // remove _?slim
        evidence.provided_by = us.uniq(
          evidence.provided_by.map(db => db.replace(/_?slim/, ''))
        );

        // Provide icon and label for database (provided_by)
        evidence.provided_by = evidence.provided_by.map((db) => {
          const [icon, srcLabel] = sourceToImage(db);
          return {
            label: srcLabel,
            icon: '../img/sources/' + icon
          };
        });

        // add href for ECO code
        evidence.evidence_types = evidence.evidence_types.map(eco => ({
          id: eco.id,
          label: eco.label,
          url: this.eviHref(eco.id)
        }));

        const supportIcons = [];

        if (evidence.evidence_types.length > 0) {
          const eviIcon = 'fa-flask'; // 'fa-legal' 'fa-chain';
          supportIcons.push(eviIcon);
        }

        if (evidence.publications.length > 0) {
          const pubIcon = 'fa-book';
          supportIcons.push(pubIcon);
        }

        if (evidence.provided_by.length > 0) {
          const sourceIcon = 'fa-database';
          supportIcons.push(sourceIcon);
        }

        const supportLength = [
          evidence.provided_by.length,
          evidence.publications.length,
          evidence.evidence_types.length,
        ].reduce((accum, item) => accum + item);

        if (objectTaxon.id && this.allFacets().includes(objectTaxon.id) && !this.trueFacets().includes(objectTaxon.id)) {
          // console.log('skipping', objectTaxon.id, elem);
        } else {
          let modifiedCardType = this.cardType;
          if (
            modifiedCardType === 'interaction'
            || modifiedCardType === 'ortholog-phenotype'
            || modifiedCardType === 'ortholog-disease'
          ) {
            modifiedCardType = 'gene';
            objectTaxon = this.parseTaxon(subjectElem);
          } else if (modifiedCardType === 'homolog') {
            modifiedCardType = 'gene';
            objectTaxon = this.parseTaxon(objectElem);
          } else if (
            modifiedCardType === 'causal-disease'
            || modifiedCardType === 'noncausal-disease'
          ) {
            modifiedCardType = 'disease';
          } else if (
            modifiedCardType === 'causal-gene'
            || modifiedCardType === 'noncausal-gene'
          ) {
            modifiedCardType = 'gene';
          }
          let objectLink = `/${modifiedCardType}/${objectElem.id}`;

          if (modifiedCardType === 'model') {
            // Models are an index level type (not in our db)
            // see if the resolver can better type this node
            objectLink = `/${objectElem.id}`;
          }

          if (objectElem.id.startsWith('BNODE')
              && modifiedCardType !== 'publication') {
            objectLink = null;
          }

          const subjectLink = `/${this.nodeType}/${subjectElem.id}`;

          this.fixupRelation(elem, this.nodeType, this.cardType);

          this.rows.push({
            annotationType: this.cardType,
            evidence,
            supportLength,
            supportIcons,
            objectCurie: objectElem.id,
            assocObject: objectElem.label,
            objectLink,
            assocSubject: subjectElem.label,
            subjectLink,
            taxonLabel: objectTaxon.label,
            taxonId: objectTaxon.id,
            relation: elem.relation,
            frequency: elem.frequency,
            onset: elem.onset,
            _showDetails: false,
          });

          elem.relation.url = this.relationHref(elem.relation);
          if (elem.frequency) {
            elem.frequency.url = this.frequencyHref(elem.frequency);
          }
          if (elem.onset) {
            elem.onset.url = this.onsetHref(elem.onset);
          }
        }
      });

      // console.log('this.associationData', this.associationData.numFound, this.rows.length);
      // console.log(JSON.stringify(this.associationData.associations, null, 2));
      this.totalAssociations = this.associationData.numFound;
    },
    generateFields() {
      this.hasTaxon = false;
      this.hasFrequencyOnset = false;
      let spliceStart = 2;

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
          key: 'support',
          class: 'support-column-width',
          label: 'Support',
        },
      ];

      if (this.isGroup) {
        fields.splice(spliceStart, 0, {
          key: 'assocSubject',
          label: this.firstCap(this.nodeType),
          class: 'assoc-subject',
        });
        spliceStart++;
      }

      if (isFrequencyOnsetType(this.nodeType, this.cardType)) {
        this.hasFrequencyOnset = true;
        fields.splice(spliceStart, 0, {
          key: 'frequency',
          label: 'Frequency',
          class: 'frequency-column-width',
        });

        spliceStart++;

        fields.splice(spliceStart, 0, {
          key: 'onset',
          label: 'Onset',
          class: 'onset-column-width',
        });
      }
      if (isTaxonCardType(this.cardType)) {
        this.hasTaxon = true;
        fields.splice(0, 0, {
          key: 'taxon',
          label: 'Species'
          // sortable: true,
        });
      }
      this.fields = fields;
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

    eviHref(ecoId) {
      const curie = ecoId || '';
      const identifier = curie.split(/[:]+/).pop();
      return `http://purl.obolibrary.org/obo/ECO_${identifier}`;
    },
    relationHref(relation) {
      const curie = relation.id || '';
      const identifier = curie.split(/[:]+/).slice(-2, 2).join('_');
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
    frequencyHref(frequency) {
      const curie = frequency.id || '';
      const identifier = curie.split(/[:]+/).slice(-2, 2).join('_');
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
    onsetHref(onset) {
      const curie = onset.id || '';
      const identifier = curie.split(/[:]+/).slice(-2, 2).join('_');
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
  }
};
</script>

<style lang="scss">
@import "~@/style/variables";
.assoc-table {
  width: 100%;
  .loading-div {
      margin: 15% calc(50% - 14%);
      text-align: center;
  }

  .table {
    //width:inherit;
  }
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

  .table.b-table th {
    padding: 1px 4px;
    font-weight: 500;
    font-size: 0.9rem;
  }

  table.b-table tr.b-table-details {
    background-color: #eef2f5;
  }

  .assoc-object,
  .assoc-subject {
    min-width: 200px;
    // word-break: break-all;
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
    min-width: 120px !important;
  }

  .frequency-column-width {
    min-width: 80px !important;
  }

  .onset-column-width {
    min-width: 80px !important;
  }

  .support-is-active {
    background: lightblue;
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

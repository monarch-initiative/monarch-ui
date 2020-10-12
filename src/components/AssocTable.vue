<template>
  <div class="assoc-table">
    <div v-if="dataError" class="border p-2 m-2">
      <h3>BioLink Error</h3>
      <div class="col-xs-12">
        {{ dataError }}
      </div>
    </div>

    <div v-show="!initialLoad && !dataError" class="loading-div">
      <b-spinner class="loading-spinner" type="grow" label="Spinning" />
    </div>

    <div v-show="!dataError && initialLoad">
      <taxon-filter
        v-model="taxonFilter"
        :is-visible="isTaxonShowing"
        @toggle-filter="toggleTaxonFilter($event)"
      />
      <div>
        <h5>
          <strong v-if="totalAssociations > 0">{{ totalAssociations }}</strong>
          {{ cardType }} associations.
        </h5>

        <b-button
          v-if="nodeType === 'gene' && hasTaxon"
          class="taxon-filter"
          size="sm"
          variant="primary"
          @click="toggleTaxonFilter()"
        >
          <i
            class="fa fa-filter"
            :class="{ 'filter-active': hasFalseFilter() }"
            aria-hidden="true"
          />
          Taxon Filter
        </b-button>
        <br />
      </div>
      <div>
        <b-form-group class="col-6">
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              :placeholder="filterPlaceHolder"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </div>
      <b-table
        ref="tableRef"
        :items="rowsProvider"
        :busy="tableBusy"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :no-provider-sorting="noProviderSorting"
        :no-provider-filtering="noProviderFiltering"
        sort-icon-left
        responsive="true"
        class="table-sm"
      >
        <template v-if="hasTaxon" v-slot:cell(taxon)="data">
          <i>{{ data.item.taxonLabel }}</i>
        </template>

        <template v-slot:cell(relation)="data">
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

        <template v-slot:cell(assocObject)="data">
          <template v-if="data.item.objectLink">
            <strong>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <router-link
                :to="data.item.objectLink"
                v-html="$sanitizeText(data.item.assocObject)"
              />
            </strong>
          </template>
          <template v-else>
            <strong>
              {{ data.item.assocObject }}
            </strong>
          </template>
        </template>

        <template
          v-if="isGroup || cardType.includes('ortholog')"
          v-slot:cell(assocSubject)="data"
        >
          <template v-if="data.item.subjectLink">
            <strong>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <router-link
                :to="data.item.subjectLink"
                v-html="$sanitizeText(data.item.assocSubject)"
              >
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

        <template v-if="hasFrequencyOnset" v-slot:cell(frequency)="data">
          <a
            v-if="data.item.frequency && nodeId === data.item.subjectCurie"
            :href="data.item.frequency.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>
              {{ data.item.frequency.label }}
            </small>
          </a>
        </template>

        <template v-if="hasFrequencyOnset" v-slot:cell(onset)="data">
          <a
            v-if="data.item.onset && nodeId === data.item.subjectCurie"
            :href="data.item.onset.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>
              {{ data.item.onset.label }}
            </small>
          </a>
        </template>

        <template v-slot:cell(support)="data">
          <b-button
            :pressed.sync="data.item._showDetails"
            size="small"
            class="btn btn-xs px-1 py-0 m-0"
            variant="outline-info"
          >
            <span v-if="data.item._showDetails">
              &blacktriangledown;&nbsp;
            </span>
            <span v-else> &blacktriangleright;&nbsp; </span>

            <span v-for="(icon, index) in data.item.supportIcons" :key="index">
              <i :class="icon" class="fa fa-fw" />
            </span>
            <small>{{ data.item.supportLength }}</small>
          </b-button>
        </template>

        <template v-slot:row-details="row">
          <EvidenceViewer
            :evidence="row.item.evidence"
            :evidence-cache="evidenceCache"
            :node-id="nodeId"
            :node-label="nodeLabel"
            :node-type="nodeType"
            :subject-id="row.item.subjectCurie"
            :subject-label="row.item.assocSubject"
            :card-type="cardType"
          />
        </template>
      </b-table>
      <b-pagination
        v-if="totalAssociations > rowsPerPage"
        v-model="currentPage"
        :per-page="rowsPerPage"
        :total-rows="totalAssociations"
        class="pag-width my-1"
        align="center"
        size="md"
      />
    </div>
  </div>
</template>

<script>
import us from "underscore";
import {
  processPublications,
  processSources,
  sanitizeNodeLabel,
  sanitizeText,
} from "@/lib/Utils";
import EvidenceViewer from "@/components/EvidenceViewer.vue";
import * as bioLinkService from "@/api/BioLink";
import TaxonFilter from "@/components/TaxonFilter.vue";
import { isTaxonCardType } from "../lib/TaxonMap";
import sourceToLabel from "../lib/sources";

export default {
  components: {
    EvidenceViewer,
    "taxon-filter": TaxonFilter,
  },
  props: {
    nodeId: {
      type: String,
      required: true,
    },
    nodeLabel: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
    },
    taxonCounts: {
      type: Object,
      required: true,
    },
    isFacetsShowing: {
      type: Boolean,
      required: false,
      default: false,
    },
    isGroup: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 15,
      totalAssociations: 0,
      hasTaxon: false,
      hasFrequencyOnset: false,
      associationData: "",
      tableBusy: false,
      dataError: false,
      initialLoad: false,
      fields: [],
      rows: [],
      lastSelection: [],
      evidenceCache: {},
      taxonFilter: {
        counts: {},
        taxons: {},
      },
      filterActive: null,
      isTaxonShowing: this.isFacetsShowing,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      noProviderSorting: true,
      noProviderFiltering: true
    };
  },
  watch: {
    cardType() {
      this.taxonFilter = { counts: {}, taxons: {} };
      this.initialLoad = false;
      this.dataError = false;
      this.isTaxonShowing = false;

      window.scroll(0, 0);
      this.currentPage = 1;
      this.generateFields();

      this.$refs.tableRef.refresh();
    }
  },
  mounted() {
    this.generateFields();
  },
  computed: {
      sortOptions() {
              return this.fields
              .filter(f => f.sortable)
              .map(f => {
                return { text: f.label, value: f.key }
              })
      },
      filterOn(){
        return this.fields.filter(f => f.filterable).map(f => {
          return f.key;
        });
      },
      filterPlaceHolder(){
        return "Filter by " + this.firstCap(this.cardType);
      }
  },
  methods: {
    toggleTaxonFilter(shouldApply) {
      if (this.isTaxonShowing && shouldApply) {
        this.$refs.tableRef.refresh();
      }
      this.isTaxonShowing = !this.isTaxonShowing;
    },
    hasFalseFilter() {
      let foundFalseTaxons = false;
      Object.entries(this.taxonFilter.taxons).forEach((elem) => {
        if (!elem[1]) {
          foundFalseTaxons = true;
        }
      });
      return foundFalseTaxons;
    },
    trueTaxonFilters() {
      const truth = [];
      Object.entries(this.taxonFilter.taxons).forEach((elem) => {
        if (elem[1]) {
          truth.push(elem[0]);
        }
      });
      return truth;
    },
    async rowsProvider(ctx, callback) {
      this.fetchData()
        .then(() => {
          callback(this.rows);
        })
        .catch((error) => {
          callback([]);
        });
    },
    async fetchData(reset) {
      const that = this;
      this.tableBusy = true;
      this.dataError = false;
      try {
        const params = {
          fetch_objects: true,
          start: (this.currentPage - 1) * this.rowsPerPage,
          rows: this.rowsPerPage,
        };

        const taxons = this.hasFalseFilter() ? this.trueTaxonFilters() : null;
        const associationsResponse = await bioLinkService.getNodeAssociations(
          this.nodeType,
          this.nodeId,
          this.cardType,
          taxons,
          params
        );

        if (
          !associationsResponse.data ||
          !associationsResponse.data.associations
        ) {
          that.associationData = null;
          throw new Error("BioLink returned no data");
        }

        that.associationData = associationsResponse.data;

        if (reset) {
          this.currentPage = 1;
        }
        that.populateRows();
        that.tableBusy = false;
        this.initialLoad = true;
      } catch (e) {
        that.dataError = e;
        // console.log('BioLink Error', e);
      }
    },
    fixupRelation(elem, nodeType, cardType) {
      const relation = elem.relation;

      if (!relation) {
        // console.log(JSON.stringify(elem, null, 2));
        elem.relation = {
          label: "Unknown",
          id: "RO:Unknown",
        };
      } else {
        let inverse = false;
        if (!relation.label && relation.id) {
          relation.label = relation.id;
        } else if (!relation.label) {
          relation.label = "";
          relation.id = "";
        }
        relation.label = relation.label.replace(/_/g, " ");
        if (relation.id === "RO:0003301") {
          if (nodeType === "model") {
            relation.id = "RO:0002615";
            relation.label = "has model";
          }
        } else if (relation.id === "RO:0002615") {
          if (nodeType !== "model") {
            relation.id = "RO:0003301";
            relation.label = "is model of";
          }
        } else if (relation.id === "RO:0002206") {
          if (nodeType === "gene" && cardType === "anatomy") {
            relation.id = "RO:0002292";
            relation.label = "expresses";
          }
        } else if (relation.id === "RO:0002607") {
          if (nodeType === "gene" && cardType === "disease") {
            inverse = true;
          }
        } else if (relation.id === "RO:0003303") {
          if (cardType === "disease" || cardType === "phenotype") {
            inverse = true;
          }
        } else if (relation.id === "RO:0003304") {
          if (cardType === "disease" || cardType === "phenotype") {
            inverse = true;
          }
        } else if (relation.id === "GENO:0000841") {
          if (nodeType === "gene" && cardType === "disease") {
            inverse = true;
          }
        } else if (relation.id === "GENO:0000408") {
          if (nodeType === "variant" && cardType === "gene") {
            relation.id = "GENO:0000413";
            relation.label = "has allele";
          }
        } else if (relation.id === "RO:0002331") {
          if (nodeType === "gene" && cardType === "pathway") {
            inverse = true;
          }
        } else if (relation.id === "GENO:0000639") {
          if (nodeType === "variant" && cardType === "gene") {
            inverse = true;
          }
          relation.inverse = inverse;
        }
      }
    },
    populateRows() {
      this.rows = [];
      let count = 0;
      this.associationData.associations.forEach((elem) => {
        count += 1;
        const objectElem = elem.object;
        const subjectElem = elem.subject;
        let objectTaxon = this.parseTaxon(objectElem);
        const evidence = us.pick(elem, [
          "id",
          "provided_by",
          "publications",
          "evidence_types",
        ]);
        evidence.publications = processPublications(evidence.publications);
        evidence.provided_by = processSources(evidence.provided_by);
        // Provide icon and label for database (provided_by)
        evidence.provided_by = evidence.provided_by.map((db) =>
          sourceToLabel(db)
        );
        // add href for ECO code
        evidence.evidence_types = evidence.evidence_types.map((eco) => ({
          id: eco.id,
          label: eco.label,
          url: this.eviHref(eco),
        }));
        const supportIcons = [];
        if (evidence.evidence_types.length > 0) {
          const eviIcon = "fa-flask"; // 'fa-legal' 'fa-chain';
          supportIcons.push(eviIcon);
        }
        if (evidence.publications.length > 0) {
          const pubIcon = "fa-book";
          supportIcons.push(pubIcon);
        }
        if (evidence.provided_by.length > 0) {
          const sourceIcon = "fa-database";
          supportIcons.push(sourceIcon);
        }
        const supportLength = [
          evidence.provided_by.length,
          evidence.publications.length,
          evidence.evidence_types.length,
        ].reduce((accum, item) => accum + item);

        let modifiedCardType = this.cardType;
        if (modifiedCardType === "interaction") {
          modifiedCardType = "gene";
          objectTaxon = this.parseTaxon(subjectElem);
        } else if (modifiedCardType === "ortholog-phenotype") {
          modifiedCardType = "phenotype";
          objectTaxon = this.parseTaxon(subjectElem);
        } else if (modifiedCardType === "ortholog-disease") {
          modifiedCardType = "disease";
          objectTaxon = this.parseTaxon(subjectElem);
        } else if (modifiedCardType === "homolog") {
          modifiedCardType = "gene";
          objectTaxon = this.parseTaxon(objectElem);
        } else if (
          modifiedCardType === "causal-disease" ||
          modifiedCardType === "correlated-disease"
        ) {
          modifiedCardType = "disease";
        } else if (
          modifiedCardType === "causal-gene" ||
          modifiedCardType === "correlated-gene"
        ) {
          modifiedCardType = "gene";
        }

        let objectLink = `/${modifiedCardType}/${objectElem.id}`;

        if (modifiedCardType === "model") {
          // Models are an index level type (not in our db)
          // see if the resolver can better type this node
          objectLink = `/${objectElem.id}`;
        }

        if (
          objectElem.id.startsWith("BNODE") &&
          modifiedCardType !== "publication"
        ) {
          objectLink = null;
        }

        if (subjectElem.label !== sanitizeText(subjectElem.label)) {
          subjectElem.label = sanitizeNodeLabel(subjectElem.label);
        }

        if (objectElem.label !== sanitizeText(objectElem.label)) {
          objectElem.label = sanitizeNodeLabel(objectElem.label);
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
          subjectCurie: subjectElem.id,
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
      });
      if (isTaxonCardType(this.cardType)) {
        const taxonFacetTarget = Object.keys(
          this.associationData.facet_counts
        )[0];
        Object.keys(
          this.associationData.facet_counts[taxonFacetTarget]
        ).forEach((key) => {
          this.taxonFilter.taxons[key] = true;
        });
        this.taxonFilter.counts = this.associationData.facet_counts[
          taxonFacetTarget
        ];
      }
      this.totalAssociations = this.associationData.numFound;
    },
    getTotalRowCounts() {
      let count = 0;

      Object.values(this.trueTaxonFilters()).forEach((taxon) => {
        count += this.taxonFilter.counts[taxon];
      });

      return count;
    },
    generateFields() {
      this.hasTaxon = false;
      this.hasFrequencyOnset = false;
      let spliceStart = 2;

      const fields = [
        {
          key: "assocObject",
          label: this.firstCap(this.cardType),
          class: "assoc-object",
          sortable: true,
          filterable: true
        },
        {
          key: "relation",
          label: "Relation",
          class: "relation-column-width",
          sortable: true
        },
        {
          key: "support",
          class: "support-column-width",
          label: "Support"
        },
      ];

      if (this.isGroup) {
        fields.splice(spliceStart, 0, {
          key: "assocSubject",
          label: this.firstCap(this.nodeType),
          class: "assoc-subject",
          sortable: true
        });
        spliceStart++;
      }

      if (this.cardType.includes("ortholog")) {
        fields.splice(0, 0, {
          key: "assocSubject",
          label: this.firstCap(this.nodeType),
          class: "assoc-subject",
          sortable: true
        });
        spliceStart++;
      }

      if (this.isFrequencyOnsetType(this.nodeType, this.cardType)) {
        this.hasFrequencyOnset = true;
        fields.splice(spliceStart, 0, {
          key: "frequency",
          label: "Frequency",
          class: "frequency-column-width",
        });

        spliceStart++;

        fields.splice(spliceStart, 0, {
          key: "onset",
          label: "Onset",
          class: "onset-column-width",
        });
      }
      if (isTaxonCardType(this.cardType)) {
        this.hasTaxon = true;
        fields.splice(0, 0, {
          key: "taxon",
          label: "Species",
          sortable: true,
        });
      }
      this.fields = fields;
    },
    parseTaxon(elemObj) {
      const taxon = {
        label: "",
        id: "",
      };
      if ("taxon" in elemObj) {
        taxon.label = elemObj.taxon.label;
        taxon.id = elemObj.taxon.id;
      }
      return taxon;
    },
    firstCap(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    pubHref(curie) {
      return `/publication/${curie}`;
      // const identifier = curie.split(/[:]+/).pop();
      // return `https://www.ncbi.nlm.nih.gov/pubmed/${identifier}`;
    },
    eviHref(evi) {
      const curie = evi.id || "";
      const identifier = curie.split(/[:]+/).pop();
      return `http://purl.obolibrary.org/obo/ECO_${identifier}`;
    },
    relationHref(relation) {
      const curie = relation.id || "";
      const identifier = curie.split(/[:]+/).slice(-2, 2).join("_");
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
    frequencyHref(frequency) {
      const curie = frequency.id || "";
      const identifier = curie.split(/[:]+/).slice(-2, 2).join("_");
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
    onsetHref(onset) {
      const curie = onset.id || "";
      const identifier = curie.split(/[:]+/).slice(-2, 2).join("_");
      return `http://purl.obolibrary.org/obo/${identifier}`;
    },
    sourceLabel(url) {
      const result = url.split(/[/]+/).pop().split(/[.]+/)[0].toUpperCase();
      return result;
    },
    isFrequencyOnsetType(nodeType, cardType) {
      return (
        (nodeType === "disease" && cardType === "phenotype") ||
        (nodeType === "phenotype" && cardType === "disease")
      );
    },
    sortCompare(aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
      const a = aRow[key] // or use Lodash `_.get()`
      const b = bRow[key]
      if (
        (typeof a === 'number' && typeof b === 'number') ||
        (a instanceof Date && b instanceof Date)
      ) {
        // If both compared fields are native numbers or both are native dates
        return a < b ? -1 : a > b ? 1 : 0
      } else {
        // Otherwise stringify the field data and use String.prototype.localeCompare
        return toString(a).localeCompare(toString(b), compareLocale, compareOptions)
      }
    }
  },
};
</script>

<style lang="scss">
@import "~@/style/variables";
.assoc-table {
  width: 100%;

  .filter-active {
    color: #cce34c;
  }

  .loading-div {
    margin: 15% calc(50% - 14%);
    text-align: center;
  }

  .loading-spinner {
    color: $monarch-bg-color;
  }

  .taxon-filter {
    background-color: $monarch-bg-color;
    margin-bottom: 15px;
  }

  .table {
    width: 100%;
  }
  .table.b-table tr {
    outline: 1px solid lightgray;
  }

  table.b-table.b-table-selectable > tbody > tr {
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

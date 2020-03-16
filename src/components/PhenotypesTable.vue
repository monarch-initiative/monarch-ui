<template>
  <div>
    <div v-if="dataFetched">
      <h6>Source data for each match result (each column) in the Phenogrid above is represented as a row in the table below.</h6>
      <b-form-input v-model="filter" placeholder="Filter by match or taxon"></b-form-input>
      <b-table
        :items="filtered"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="true"
        class="table-border-soft"
      >
        <template v-slot:cell(score)="data">
          <span class="ic-score">{{data.item.score}}</span>
        </template>
      </b-table>
      <div v-if="items.length > 10">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="filtered.length"
          class="my-1"
          align="center"
          size="md"
        />
      </div>
    </div>
    <div v-else>Loading Phenotype Comparison Table ...</div>
  </div>
</template>
<script>
import * as bioLinkService from '@/api/BioLink';

export default {
  props: {
    source: {
      type: Array,
      required: true
    },
    targetSpecies: {
      type: String,
      required: false,
      default: '9606'
    },
    compare: {
      type: Array,
      required: false,
      default: null,
    },
    mode: {
      type: String,
      required: true,
      default: 'search'
    }
  },


  data() {
    return {
      dataFetched: false,
      rowsPerPage: 10,
      currentPage: 1,
      filter: '',
      sortBy: 'score',
      sortDesc: 'true',
      fields: [
         {
          key: 'hitLabel',
          label: 'Match Label',
          sortable: true
        },
        {
          key: 'hitId',
          label: 'Match Identifier',
          sortable: true
        },
        {
          label: 'Similarity Score',
          key: 'score',
          sortable: true
        },
        {
          key: 'taxonLabel',
          label: 'Taxon Label',
          sortable: true
        }
      ],
      items: [],
      preItems: []
    };
  },
  watch: {
    phenotypes() {
      this.comparePhenotypes();
    },
    preItems() {
      this.processItems();
    }
  },
  computed: {
    filtered () {
      const filterValue = this.filter;
      const fields = ["hitLabel", "hitId", "taxonId", "taxonLabel"];
      const filtered = this.items.filter( row => {
        return fields.some(field => {
          return row[field].includes(filterValue);
        })
      });
      return filtered.length > 0 ? filtered : this.items;
    }
  },
  mounted() {
    this.comparePhenotypes();
  },
  methods: {
    async comparePhenotypes() {
      const that = this;
      try {
        console.log(this.source);
        console.log(this.compare);
        const searchResponse = await bioLinkService.comparePhenotypes(this.source, this.compare, this.mode);
        this.preItems = searchResponse;
        this.dataFetched = true;
      } catch (e) {
        that.dataError = e;
        console.log('BioLink Error', e);
      }
    },
    processItems(){
      this.items = [];
      this.preItems.data.matches.forEach((elem) => {
        const rowData = {
          hitLabel: elem.label,
          hitId: elem.id,
          score: elem.score,
          taxonLabel: elem.taxon.label  !== null ? elem.taxon.label : "-"
        }
        this.items.push(rowData);
      });
    },
    round(value, decimals) {
      return value.toFixed(decimals);
    }
  }
};
</script>

<style>
  .ic-score{
    color: rgb(135, 99, 163);
  }
</style>

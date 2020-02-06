<template>
  <div>
    <div v-if="dataFetched">
      <b-table
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        responsive="true"
        class="table-border-soft"
      >
        <template
          slot="hitLabel"
          slot-scope="data"
        >
          <strong>{{ data.item.hitLabel }}</strong>
        </template>
        <template
          slot="hitId"
          slot-scope="data"
        >
          {{ data.item.hitId }}
        </template>
        <template
          slot="mostInformativeLabel"
          slot-scope="data"
        >
          {{ data.item.mostInformativeLabel }}
        </template>
        <template
          slot="misp_ic"
          slot-scope="data"
        >
          {{ data.item.mostInformativeIc }}
        </template>
        <template
          slot="other_matching_phenotypes"
          slot-scope="data"
        >
          <router-link :to="data.item.otherMatchLink">
            {{ data.item.otherMatchLabel }}
          </router-link>
        </template>
        <template
          slot="omp_ic"
          slot-scope="data"
        >
          {{ data.item.otherMatchIc }}
        </template>
      </b-table>
      <div v-if="items.length > 10">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="items.length"
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
          key: 'taxonId',
          label: 'Taxon Id',
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
  mounted() {
    this.comparePhenotypes();
  },
  methods: {
    async comparePhenotypes() {
      const that = this;
      try {
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
          taxonId: elem.taxon.id,
          taxonLabel: elem.taxon.label
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

</style>

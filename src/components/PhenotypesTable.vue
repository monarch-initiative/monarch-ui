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
import * as BL from '@/api/BioLink';

export default {
  props: {
    phenotypes: {
      type: Array,
      required: true
    },
    targetSpecies: {
      type: String,
      required: false,
      default: '9606'
    },
    geneList: {
      type: Array,
      required: false,
    }
  },


  data() {
    return {
      test: {  combinedScore: 65,
        hitId: "MONDO:0015999",
        hitLabel: "primary pigmented nodular adrenocortical disease",
        mostInformativeIc: "10.16",
        mostInformativeId: "HP:0001065",
        mostInformativeLabel: "Striae distensae",
        mostInformativeLink: "/phenotype/HP:0001065",
        otherMatchIc: "3.67",
        otherMatchId: "MP:0001533",
        otherMatchLabel: "abnormal skeleton physiology",
        otherMatchLink: "/phenotype/MP:0001533"},
      dataFetched: false,
      rowsPerPage: 10,
      currentPage: 1,
      fields: [
        { key: 'hitLabel',
          label: 'Match Label',
          sortable: true
        },
        { key: 'hitId',
          label: 'Match Identifier',
          sortable: true
        },
        {
          label: 'Similarity Score',
          key: 'combinedScore',
          sortable: true
        },
        { key: 'mostInformativeLabel',
          label: 'Most Informative Phenotype',
          sortable: true
        },
        {
          key: 'mostInformativeId',
          label: 'Most Informative Id',
          sortable: true,
        },{
          key: 'mostInformativeIc',
          label: 'Most Informative IC Score',
          sortable: true,
        },

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
        const searchResponse = await BL.comparePhenotypes(this.phenotypes, this.genes);
        this.preItems = searchResponse;
        this.dataFetched = true;
      }
      catch (e) {
        that.dataError = e;
        console.log('BioLink Error', e);
      }
    },
    processItems() {
      this.items = [];
      this.preItems.data.results.forEach((elem) => {
        const rowData = {
          hitLabel: elem.j.label,
          hitId: elem.j.id,
          mostInformativeId: elem.maxIC_class.id,
          mostInformativeIc: this.round(elem.maxIC_class.IC, 2),
          mostInformativeLabel: elem.maxIC_class.label,
          mostInformativeLink: `/phenotype/${elem.maxIC_class.id}`,
          combinedScore: elem.combinedScore,
          otherMatchId: '',
          otherMatchLabel: '',
          otherMatchIc: '',
          otherMatchLink: ''
        };
        elem.matches.forEach((match) => {
          if (match.lcs.id !== rowData.hitId) {
            rowData.otherMatchIc = this.round(match.lcs.IC, 2);
            rowData.otherMatchId = match.lcs.id;
            rowData.otherMatchLabel = match.lcs.label;
            rowData.otherMatchLink = `/phenotype/${match.lcs.id}`;
          }
        });
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

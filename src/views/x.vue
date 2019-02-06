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
          @row-clicked="clickedRow"
      >
        <template
            slot="hit"
            slot-scope="data"
        >
          <strong>{{ data.item.hitLabel }}</strong>
        </template>
        <template
            slot="combined_score"
            slot-scope="data"
        >
          {{ data.item.combinedScore }}
        </template>
        <template
            slot="most_informative_shared_phenotype"
            slot-scope="data"
        >
          <router-link
              :to="data.item.mostInformativeLink">
            {{ data.item.mostInformativeLabel }}
          </router-link>

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
      matcher: {
        type: String,
        required: true
      },
    },
    data() {
      return {
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
          { key: 'percentScore',
            label: 'Percentage Score',
            sortable: true
          },
          {
            label: 'Rank',
            key: 'rank',
            sortable: true,
          },
          {
            label: 'Raw Score',
            key: 'rawScore',
            sortable: true
          },
          {
            label: 'Score',
            key: 'score',
            sortable: true,
          },
          {
            label: 'Signifcance',
            key: 'signifcance',
            sortable: true,
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
      },
      matcher() {
        this.comparePhenotypes();
      },
    },
    mounted() {
      this.comparePhenotypes();
    },
    methods: {
      async comparePhenotypes() {
        const that = this;
        try {
          const searchResponse = await BL.comparePhenotypes(this.phenotypes, this.matcher);
          this.preItems = searchResponse.data.matches;
          this.dataFetched = true;
        }
        catch (e) {
          that.dataError = e;
          console.log('BioLink Error', e);
        }
      },
      clickedRow(row) {
        this.$router.push({ path: `/disease/${row.hitId}/` })
      },
      processItems() {
        this.items = [];
        this.preItems.forEach((elem) => {
          const rowData = {
            hitLabel: elem.matchLabel,
            hitId: elem.matchId,
            percentScore: elem.percentageScore,
            rank: elem.rank,
            rawScore: elem.rawScore,
            score: elem.score,
            significance: elem.significance,
          };
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

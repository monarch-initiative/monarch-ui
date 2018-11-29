<template>
  <div class="container-fluid">
    <div class="row wizard-style">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <span  style="text-align: center; margin-bottom: 15px;"><h1>Phenotype Similarity Search</h1></span>
        <h4>Create A Profile of Phenotypes</h4>
        <div class="row">
          <div class="col-2">
            <b-form-group v-b-tooltip.hover.bottomright title="Search for phenotypes individually or a set of phenotypes by a disease">
              <b-form-radio-group id="category"
                                  buttons
                                  button-variant="outline-info"
                                  size="sm"
                                  v-model="searchSelected"
                                  :options="searchType"
                                  name="radioBtnOutline"/>
            </b-form-group>
          </div>
          <div class="col-8"></div>
          <div class="col-2" style="float:right">
            <b-form-group v-b-tooltip.hover.bottomright title="Select a matching algorhithm">
              <b-form-radio-group id="matchers"
                                  buttons
                                  button-variant="outline-info"
                                  size="sm"
                                  v-model="matcherSelected"
                                  :options="matchers"
                                  name="radioBtnOutline"/>
            </b-form-group>
          </div>
        </div>
        <monarch-autocomplete
            :show-search-button="false"
            :home-search="false"
            :placeholder-text="phText"
            :single-category="searchSelected"
            @interface="handlePhenotypes"s
        />
        <b-form-textarea
            id="textarea1"
            v-model="phenoCurieList"
            :rows="3"
            :max-rows="6"
            placeholder="Enter a comma separated list of prefixed phenotype ids e.g. HP:0000322"
            class="my-2"
        />

        <div v-if="phenoCurieList"
             class="btn btn-outline-info"
             @click="generatePGDataFromPhenotypeList"
        >
          Submit Phenotype List
        </div>
        <b-alert
            :show="showPhenotypeAlert"
            variant="danger"
            class="my-2"
            dismissible
            @dismissed="showPhenotypeAlert=false"
        >
          Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype curies from HP, MP, or ZP!
        </b-alert>
      </div>
      <div class="col-1"/>
    </div>

    <!--results below here-->
    <div v-if="phenotypes.length">
      <div
          class="row my-2"
      >
        <div class="col-1">
        </div>
        <div class="col-10 card">
          <div class="p-3">
            <h4>Phenotype Profile</h4>
            <div class="flex-container">
              <div
                  v-for="(phenotype, index) in phenotypes"
                  :key="phenotype.curie"
                  class="m-1"
              >
                <div
                    class="btn-group"
                    role="group"
                >
                  <button
                      v-b-modal="phenotype.curie"
                      class="btn btn-sm btn-info"
                  >
                    {{ phenotype.match }} ({{ phenotype.curie }})
                  </button>
                  <button
                      type="button"
                      class="btn btn-sm btn-info"
                      @click="popPhenotype(index)"
                  >
                    <strong>x</strong>
                  </button>
                </div>
                <b-modal
                    :id="phenotype.curie"
                    size="lg"
                    title="phenotype.label"
                >
                  <div
                      slot="modal-title"
                      class="w-100"
                  >
                    {{ phenotype.match }} | {{ phenotype.curie }}
                  </div>
                  <div>
                    <local-nav
                        :anchor-id="phenotype.curie"
                        @interface="handleReplacePhenotype"
                    />
                  </div>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
        <div class="col-1"/>
      </div>
    </div>
    <div  v-if="phenotypes.length"
          class="row">
      <div class="col-1"></div>
      <div class="col-10 card p-0 my-5">
        <div class="btn btn-outline-success"
             @click="generatePhenogridData()"
        >
          Run Similarity Analysis
        </div>
      </div>
      <div class="col-1"></div>
    </div>
    <!--<div class="row">-->
      <!--<div class="col-1"/>-->
      <!--<div-->
          <!--v-show="showPhenogrid"-->
          <!--class="col-10 card"-->
      <!--&gt;-->
        <!--<pheno-grid-->
            <!--:x-axis="xAxis"-->
            <!--:y-axis="yAxis"-->
        <!--/>-->
      <!--</div>-->
      <!--<div class="col-1"/>-->
    <!--</div>-->
    <div
        v-if="showPhenogrid"
        class="row my-3">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <phenotypes-table
            :phenotypes="phenotypes"
            :matcher="matcherSelected"
        />
      </div>
      <div class="col-1"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueFormWizard from 'vue-form-wizard';
  import 'vue-form-wizard/dist/vue-form-wizard.min.css';
  import * as BL from '@/api/BioLink';
  import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';
  import PhenoGrid from '@/components/PhenoGrid.vue';
  import LocalNav from '@/components/LocalNav.vue';
  import PhenotypesTable from '@/components/PhenotypesTable.vue';

  Vue.use(VueFormWizard);

  const findIndex = require('lodash/findIndex');

  export default {
    name: 'AnalyzePhenotypes',
    components: {
      'monarch-autocomplete': MonarchAutocomplete,
      'pheno-grid': PhenoGrid,
      'phenotypes-table': PhenotypesTable,
      'local-nav': LocalNav,
    },
    data() {
      return {
        matcherSelected: 'phenodigm',
        matchers: [
          { text: 'Phenodigm', value: 'phenodigm' },
          { text: 'Jaccard', value: 'jaccard' },
        ],
        searchSelected: 'Phenotype',
        searchType: [
          { text: 'Phenotype', value: 'Phenotype' },
          { text: 'Disease', value: 'disease' },
        ],
        acceptedPrefixes:['HP', 'MP', 'ZP'],
        mode: 'search',
        showPhenogrid: false,
        pgIndex: 0,
        rejectedPhenotypeCuries: [],
        showGeneAlert: false,
        showPhenotypeAlert: false,
        phenoCurieList: '',
        geneCurieList: '5290, 5728, 324, 7428, 3845',
        messages: [],
        phenotypes: [],
        genes: [],
        selectedGroups: [],
        yAxis: [],
        xAxis: [],
        geneCurieType: 'NCBIGene',
        geneCurieTypeOptions: [
          {
            text: 'NCBI Gene ID',
            value: 'NCBIGene'
          },
          {
            text: 'Ensemble Gene ID',
            value: 'ENSEMBL'
          },
          {
            text: 'HGNC Gene ID',
            value: 'HGNC'
          }
        ],
        groupOptions: [
          {
            text: 'Mus musculus (genes)',
            value: {
              groupId: '10090',
              groupName: 'Mus musculus'
            }
          },
          // {
          //   text: 'Homo sapiens (diseases)',
          //   value: {
          //     groupId: '9606',
          //     groupName: 'Homo sapiens'
          //   }
          // },
          {
            text: 'Drosophila melanogaster (genes)',
            value: {
              groupId: '7227',
              groupName: 'Drosophila melanogaster'
            }
          },
          {
            text: 'Caenorhabditis elegans (genes)',
            value: {
              groupId: '6239',
              groupName: 'Caenorhabditis elegans'
            }
          },
          {
            text: 'Danio rerio (genes)',
            value: {
              groupId: '7955',
              groupName: 'Danio rerio'
            }
          }
        ]
      };
    },
    computed: {
      phText() {
        return `Search for ${this.firstLower(this.searchSelected)}s by keyword or identifier`;
      },
      showComparableList() {
        let show = false;
        if (this.phenotypes.length) {
          if (this.genes.length || this.selectedGroups.length) {
            show = true;
          }
        }
        return show;
      }
    },
    methods: {
      firstLower(elem) {
        return elem.charAt(0).toLowerCase() + elem.substr(1);
      },
      async fetchLabel(curie, curieType) {
        const that = this;
        try {
          const searchResponse = await BL.getNodeLabelByCurie(curie);
          if (curieType === 'phenotype') {
            this.convertPhenotypes(searchResponse);
            if (searchResponse.status === 500) {
              this.showGeneAlert = false;
            }
          }
          if (curieType === 'gene') {
            this.convertGenes(searchResponse);
            if (searchResponse.status === 500) {
              this.showGeneAlert = true;
            }
          }
        }
        catch (e) {
          that.dataError = e;
          console.log('BioLink Error', e);
        }
      },
      async fetchPhenotypes(curie) {
        const that = this;
        try {
          const searchResponse = await BL.getNodeAssociations('disease', curie, 'phenotype' );
          const index = findIndex(this.phenotypes, { curie: curie });
          this.popPhenotype(index);
          searchResponse.data.associations.forEach(elem => {
            const elemIndex = findIndex(this.phenotypes, { curie: elem.object.id});
            if (elemIndex === -1) {
            this.convertPhenotypes({
              data: {
                id: elem.object.id,
                label: elem.object.label,
              }
            });
            }
          });
          if (searchResponse.status === 500) {
            this.showGeneAlert = false;
          }

        }
        catch (e) {
          that.dataError = e;
          console.log('BioLink Error', e);
        }
      },
      containsObject(obj, list) {
        return list.some(elem => elem === obj)
      },
      popPhenotype(ind) {
        this.phenotypes.splice(ind, 1);
      },
      popGroup(ind) {
        this.selectedGroups.splice(ind, 1);
      },
      popGene(ind) {
        this.genes.splice(ind, 1);
      },
      handlePhenotypes(payload) {
        if(payload.curie.includes('MONDO')) {
          this.fetchPhenotypes(payload.curie);
        }
        this.phenotypes.push(payload);
      },
      handleReplacePhenotype(payload) {
        const replaceIndex = findIndex(this.phenotypes, { curie: payload.root });
        this.phenotypes.splice(replaceIndex, 1);
        this.phenotypes.push(payload);
      },
      handleGenes(payload) {
        this.genes.push(payload);
      },
      generatePhenogridData() {
        this.showPhenogrid = true;
        if (this.selectedGroups.length) {
          this.xAxis = this.selectedGroups;
        }
        else {
          this.xAxis = [
            {
              "groupId": "9606",
              "groupName": "Homo sapiens"
            },
            {
              "groupId": "10090",
              "groupName": "Mus musculus"
            }
          ];
          // this.xAxis = this.genes.map((elem) => {
          //   this.mode = 'compare';
          //   return elem.curie;
          // });
        }
        this.yAxis = this.phenotypes.map(elem => ({
          id: elem.curie,
          term: elem.match
        }));
        this.pgIndex += 1;
      },
      geneListLookup() {
        this.genes = [];
        this.geneCurieList.split(',').forEach((elem) => {
          this.fetchLabel(`${this.geneCurieType}:${elem.trim()}`, 'gene');
        });
      },
      generatePGDataFromPhenotypeList() {
        this.rejectedPhenotypeCuries = [];
        this.phenotypes = [];
        this.phenoCurieList.split(',').forEach((elem) => {
          const elemTrimmed = elem.trim();
          const prefix = elemTrimmed.split(':')[0];
          if (this.acceptedPrefixes.includes(prefix)) {
            this.fetchLabel(elemTrimmed, 'phenotype');
          }
          else {
            this.rejectedPhenotypeCuries.push(elemTrimmed);
            this.showPhenotypeAlert = true;
          }
        });
      },
      convertGenes(elem) {
        const geneData = elem.data;
        this.genes.push({
          curie: geneData.id,
          match: geneData.label
        });
      },
      convertPhenotypes(elem) {
        const phenoData = elem.data;
        this.phenotypes.push({
          curie: phenoData.id,
          match: phenoData.label
        });
      }
    }
  };
</script>

<style scoped>
  .wizard-style {
    margin-top: 100px;
  }
  .flex-container {
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
  }
  .pad-right {
    padding-right: 4px;
    padding-left: 0;
  }
  .pad-left {
    padding-left: 4px;
    padding-right: 0;
  }
  .full-height {
    height: 100%;
  }
</style>

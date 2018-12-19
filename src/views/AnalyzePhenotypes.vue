<template>
  <div class="container-fluid py-5">
    <div class="row">
      <div class="col-2"/>
      <div class="col-8">
        <h1>Analyze Phenotypes</h1>
      </div>
      <div class="col-2"/>
    </div>
    <div class="row">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <h4>Create A Profile of Phenotypes</h4>
        <monarch-autocomplete
          :home-search="false"
          :allowed-prefixes="acceptedPrefixes"
          :defined-categories="searchPhenoCategories"
          :dynamic-placeholder="phenoSearchPH"
          @interface="handlePhenotypes"
        />
        <b-form-textarea
          id="textarea1"
          v-model="phenoCurieList"
          :rows="3"
          :max-rows="6"
          placeholder="Enter a comma separated list of prefixed phenotype ids e.g. HP:0000322"
          class="my-2"
        />

        <div
          v-if="phenoCurieList"
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
          Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype curies from the Human Phenotype Ontology (e.g.
          HP:0000002)
        </b-alert>
      </div>
      <div class="col-1"/>
    </div>
    <!--results below here-->
    <div
      v-if="phenotypes.length"
      class="row my-2"
    >
      <div class="col-1"/>
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
                  <strong>{{ phenotype.match }}</strong> | {{ phenotype.curie }}
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
                  <strong>{{ phenotype.match }}</strong> | {{ phenotype.curie }}
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
    <div class="row py-2">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <h4>Create A Profile of comparables</h4>
        <monarch-autocomplete
          :home-search="false"
          :defined-categories="searchCompCategories"
          :dynamic-placeholder="geneSearchPH"
          @interface="handleGenes"
        />
        <div class="p-2">
          <b-form-group>
            <b-form-radio-group
              id="btnradios1"
              v-model="selectedGroups"
              :options="groupOptions"
              buttons
              button-variant="outline-info"
              size="sm"
              name="radiosBtnDefault"
            />
          </b-form-group>
        </div>
        <b-form-textarea
          id="textarea2"
          v-model="geneCurieList"
          :rows="3"
          :max-rows="6"
          placeholder="Enter a comma separated list of prefixed gene ids from NCBI (e.g. NCBIGene:3845) or HGNC (e.g. HGNC:2176)"
          class="my-2"
        />
        <div
          v-if="geneCurieList"
          class="btn btn-outline-info"
          @click="generatePGDataFromGeneList"
        >
          Submit Gene List
        </div>
        <b-alert
          :show="showGeneAlert"
          variant="danger"
          class="my-2"
          dismissible
          @dismissed="showGeneAlert=false"
        >
          Error: '{{ rejectedGeneCuries }}' Please enter gene curies from NCBI (e.g. NCBIGene:3845) or HGNC (e.g. HGNC:2176)
        </b-alert>
      </div>
      <div class="col-1"/>
    </div>
    <!--results below here-->
    <div
      v-if="selectedGroups"
      class="row"
    >
      <div class="col-1"/>
      <div class="col-10 card">
        <div class="p-3">
          <h4>Taxon Group</h4>
          <div
            class="btn-group"
            role="group"
          >
            <div
              class="badge badge-info group-badge p-2"
            >
              {{ selectedGroups.groupName }}
              (NCBITaxon:{{ selectedGroups.groupId }})
            </div>
            <button
              type="button"
              class="btn btn-sm btn-info"
              @click="popGroup()"
            >
              <strong>x</strong>
            </button>
          </div>
        </div>
        <div class="col-1"/>
      </div>
    </div>
    <div
      v-if="genes.length"
      class="row my-2"
    >
      <div class="col-1"/>
      <div class="col-10 card">
        <div class="p-3">
          <h4>Gene Profile</h4>
          <div class="flex-container">
            <div
              v-for="(gene, index) in genes"
              :key="gene.curie"
              class="m-1"
            >
              <div
                class="btn-group"
                role="group"
              >
                <button
                  v-b-modal="gene.curie"
                  class="btn btn-sm btn-info"
                >
                  <strong>{{ gene.match }} </strong>({{ gene.curie }})
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-info"
                  @click="popGene(index)"
                >
                  <strong>x</strong>
                </button>
              </div>
              <b-modal
                :id="gene.curie"
                size="lg"
                title="gene.label"
              >
                <div
                  slot="modal-title"
                  class="w-100"
                >
                  {{ gene.match }} | {{ gene.curie }}
                </div>
                <div>
                  <local-nav
                    :anchor-id="gene.curie"
                    @interface="handleReplaceGene"
                  />
                </div>
              </b-modal>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"/>
    </div>
    <div
      v-if="phenotypes.length"
      class="row"
    >
      <div class="col-1"/>
      <div class="col-10 card p-0 my-5">
        <div
          class="btn btn-outline-success"
          @click="generatePhenogridData()"
        >
          Run Similarity Analysis
        </div>
      </div>
      <div class="col-1"/>
    </div>
    <div class="row">
      <div class="col-1"/>
      <div
        v-if="showPhenogrid"
        class="col-10 card"
      >
        <pheno-grid
          :x-axis="xAxis"
          :y-axis="yAxis"
          :index="pgIndex"
          :mode="mode"
        />
      </div>
      <div class="col-1"/>
    </div>
    <div
      v-if="showPhenogrid"
      class="row my-3">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <phenotypes-table :phenotypes="phenotypes"/>
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
      acceptedPrefixes: ['MONDO', 'HP', 'NCBIGene', 'HGNC'],
      phenoSearchPH: 'search for phenotypes or disease',
      geneSearchPH: 'search for genes',
      searchPhenoCategories: ['Phenotype', 'disease'],
      searchCompCategories: ['gene'],
      mode: 'search',
      showPhenogrid: false,
      pgIndex: 0,
      rejectedPhenotypeCuries: [],
      rejectedGeneCuries: [],
      showGeneAlert: false,
      showPhenotypeAlert: false,
      phenoCurieList: '',
      geneCurieList: '',
      messages: [],
      phenotypes: [],
      genes: [],
      selectedGroups: '',
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
    showComparableList() {
      let show = false;
      if (this.phenotypes.length) {
        if (this.genes.length || this.selectedGroups) {
          show = true;
        }
      }
      return show;
    }
  },
  methods: {
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
        const searchResponse = await BL.getNodeAssociations('disease', curie, 'phenotype');
        const index = this.phenotypes.map(e => e.curie).indexOf(curie);
        this.popPhenotype(index);
        searchResponse.data.associations.forEach((elem) => {
          this.convertPhenotypes({
            data: {
              id: elem.object.id,
              label: elem.object.label,
            }
          });
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
    popPhenotype(ind) {
      this.phenotypes.splice(ind, 1);
    },
    popGroup() {
      this.selectedGroups = '';
    },
    popGene(ind) {
      this.genes.splice(ind, 1);
    },
    handlePhenotypes(payload) {
      if (payload.curie.includes('MONDO')) {
        this.fetchPhenotypes(payload.curie);
      }
      this.phenotypes.push(payload);
    },
    handleReplacePhenotype(payload) {
      const replaceIndex = findIndex(this.phenotypes, {
        curie: payload.root
      });
      this.phenotypes.splice(replaceIndex, 1);
      this.phenotypes.push(payload);
    },
    handleGenes(payload) {
      this.genes.push(payload);
    },
    handleReplaceGene(payload) {
      const replaceIndex = findIndex(this.genes, {
        curie: payload.root,
      });
      this.genes.splice(replaceIndex, 1);
      this.genes.push(payload);
    },
    generatePhenogridData() {
      this.showPhenogrid = true;
      if (this.selectedGroups) {
        this.xAxis = [this.selectedGroups];
      }
      else {
        this.xAxis = this.genes.map((elem) => {
          this.mode = 'compare';
          return elem.curie;
        });
      }
      this.phenotypes.forEach(elem => this.yAxis.push({
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
    generatePGDataFromGeneList() {
      this.rejectedGeneCuries = [];
      this.genes = [];
      this.geneCurieList.split(',').forEach((elem) => {
        const elemTrimmed = elem.trim();
        const prefix = elemTrimmed.split(':')[0];
        if (this.acceptedPrefixes.includes(prefix)) {
          this.fetchLabel(elemTrimmed, 'gene');
        }
        else {
          this.rejectedGeneCuries.push(elemTrimmed);
          this.showGeneAlert = true;
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

<style>

  .group-badge {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
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

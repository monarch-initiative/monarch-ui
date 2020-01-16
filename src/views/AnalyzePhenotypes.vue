<template>
  <div class="container-fluid monarch-view">
    <div class="row">
      <div class="offset-2 col-8 text-center">
        <h2 class="page-title">Phenotype Profile Search</h2>
        <p>This Phenotype Profile Search enables you search our database using our
          <a href="https://github.com/biolink/biolink-api" target="_blank">BioLink analysis</a>
          engine to find phenotypically similar diseases or genes in a variety of organisms, then visualize
          their overlap.</p>
      </div>
    </div>
    <div v-if="!showPhenogrid" class="row">
      <div class="col-1"/>
      <!-- Step 1 of Phenotype profile search -->
      <div class="col-10 card card-body step-1">
        <div v-if="currentStep === 1">
          <h4 class="text-center">1. Create A Profile of Phenotypes
            <b-button
              v-if="currentSubStep !== 1"
              class="comparison-category-edit"
              variant="outline-info"
              @click="currentSubStep = 1; phenotypes = []">
              <i class="fa fa-pencil edit-comparison" aria-hidden="true"/> Edit Selection
            </b-button>
          </h4>
          <div v-if="currentSubStep === 1" class="center-text">
            <h6 class="center-text">How would like to continue?</h6>
            <b-form-group>
              <b-button-group>
                <b-button variant="outline-info" @click="currentSubStep = 2">Search & Build</b-button>
                <b-button variant="outline-info" @click="currentSubStep = 3">I have a phenotype list</b-button>
              </b-button-group>
            </b-form-group>
          </div>
          <div v-if="currentSubStep === 2">
            <monarch-autocomplete
              :home-search="false"
              :allowed-prefixes="acceptedPrefixes"
              :defined-categories="searchPhenoCategories"
              :dynamic-placeholder="phenoSearchPH"
              @interface="handlePhenotypes"
            />
            <small>*Non-phenotype entities will automatically be mapped to their associated phenotypes. </small>
          </div>
          <div v-if="currentSubStep === 3">
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
              class="btn btn-outline-info submit"
              @click="getPhenotypesFromEntityList"
            >
              Confirm Phenotype List
            </div>
            <b-alert
              :show="showPhenotypeAlert"
              variant="danger"
              class="my-2"
              dismissible
              @dismissed="showPhenotypeAlert=false"
            >
              Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype term id's from the Human Phenotype Ontology (e.g.
              HP:0000002)
            </b-alert>
          </div>
        </div>
        <div v-if="phenotypes.length && !showPhenogrid" class="flex-container">
          <b-button
            :class="showCollapse ? 'collapsed' : null"
            :aria-expanded="showCollapse ? 'true' : 'false'"
            variant="light"
            aria-controls="collapse-4"
            class="m-1 current-phenotype-profile"
            @click="showCollapse = !showCollapse">
            <i v-if="showCollapse" class="fa fa-eye" aria-hidden="true"/>
            <i v-if="!showCollapse" class="fa fa-eye-slash" aria-hidden="true"/>
            &nbsp;Current Phenotype Profile ( {{ phenotypes.length }} phenotypes )
            
          </b-button>
          <b-collapse id="collapse-phenotypes" v-model="showCollapse" class="flex-container">
            <div
              v-for="(phenotype, index) in phenotypes"
              :key="index"
              class="m-1 group-badge-phenotypes"
            >
              <div class="btn-group" role="group">
                <button class="btn btn-sm btn-info more-info">
                  <strong>{{ phenotype.match }}</strong> | {{ phenotype.curie }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-info pop-phenotype"
                  @click="popPhenotype(index)"
                >
                  <strong>x</strong>
                </button>
              </div>
            </div>
          </b-collapse>
        </div>
        <div class="step-1-btn-group">
          <b-button
            v-if="currentStep === 1 && phenotypes.length"
            variant="outline-primary"
            class="confirm-profile"
            @click="currentStep = 2; showCollapse = false">Confirm Profile</b-button>
          <b-button
            v-if="currentStep === 1 && phenotypes.length"
            variant="outline-primary"
            class="reset-profile"
            @click="phenotypes = []; currentSubStep = 1;">Reset Profile</b-button>
          <b-button
            v-if="currentStep === 2 && phenotypes.length"
            variant="outline-dark"
            class="edit-profile"
            @click="currentStep = 1; clearComparisonCategory">Edit Profile</b-button>
        </div>
      </div>
      <!-- end of step 1 -->
      <div class="col-1"/>
    </div>

    <!-- Step 2 Comparison Profile -->
    <div v-if="(currentStep === 2 || currentStep === 3) && !showPhenogrid" class="row py-2">
      <div class="col-1"/>
      <div class="col-10 card card-body">
        <div v-if="currentStep === 2 && !comparisonCategory" class="comparison-category-select">
          <h5>2. What would you like to compare your profile with?</h5>
          <b-form-group>
            <b-button-group>
              <b-button variant="outline-info" @click="comparisonCategory = 'all'">Everything</b-button>
              <b-button variant="outline-info" @click="comparisonCategory = 'disease'">Disease Profile</b-button>
              <b-button variant="outline-info" @click="comparisonCategory = 'gene'">Gene Profile</b-button>
              <b-button variant="outline-info" @click="comparisonCategory = 'phenotypes'">Phenotype Profile</b-button>
            </b-button-group>
          </b-form-group>
        </div>
        <div v-if="comparisonCategory">
          <h4 class="center-text">
            <span v-if="comparisonCategory != 'all'">Build your {{ comparisonCategory }} profile for comparison</span>
            <span v-if="comparisonCategory == 'all'">Comparing everything.</span>
            &nbsp;<b-button class="comparison-category-edit" variant="outline-info" @click="clearComparisonCategory"><i class="fa fa-pencil edit-comparison" aria-hidden="true"/> Edit Selection </b-button>
          </h4>
          <div v-if="comparisonCategory === 'gene'">
            <b-form-group class="center-text">
              <b-button-group>
                <b-button variant="outline-info" @click="geneComparisonCategory = 'gene-group'">Taxon Grouped Genes</b-button>
                <b-button variant="outline-info" @click="geneComparisonCategory = 'custom-build'">Search & Build</b-button>
                <b-button variant="outline-info" @click="geneComparisonCategory = 'custom-list'; genes = []">I have gene a list</b-button>
              </b-button-group>
            </b-form-group>
            <div v-if="geneComparisonCategory === 'gene-group'">
              <b-form-select v-model="selectedGeneGroup" :options="targetGeneGroups"/>
            </div>
            <div v-if="geneComparisonCategory === 'custom-build'">
              <monarch-autocomplete
                :home-search="false"
                :defined-categories="searchCompCategories"
                :dynamic-placeholder="placeholderComparisonText"
                @interface="handleGenes"
              />
            </div>
            <div v-if="geneComparisonCategory === 'custom-list'">
              <b-form-textarea
                v-if="comparisonCategory === 'gene'"
                id="textarea2"
                v-model="geneCurieList"
                :rows="3"
                :max-rows="6"
                placeholder="Enter a comma separated list of prefixed gene ids from NCBI (e.g. NCBIGene:3845) or HGNC (e.g. HGNC:2176)"
                class="my-2"
              />
              <div v-if="geneCurieList" class="btn btn-outline-info submit" @click="getGenesFromList">
                Confirm Gene List
              </div>
              <b-alert
                :show="rejectedGeneCuries.length > 0"
                variant="danger"
                class="my-2"
                dismissible
                @dismissed="rejectedGeneCuries.length == 0"
              >
                Error: {{ rejectedGeneCuries }} <br> Gene curie format incorrect should be one of NCBI (e.g. NCBIGene:3845) or HGNC (e.g. HGNC:2176)
              </b-alert>
            </div>
            <div v-if="genes.length > 0">
              <p class="current-profile">Current Gene Comparisons</p>
              <div class="flex-container">
                <div
                  v-for="(gene, index) in genes"
                  :key="index"
                  class="m-1 group-badge-phenotypes"
                >
                  <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-info more-info">
                      <strong>{{ gene.match }}</strong> | {{ gene.curie }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-info pop-phenotype"
                      @click="popGene(index)"
                    >
                      <strong>x</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="comparisonCategory === 'disease'">
            <b-form-group class="center-text">
              <b-button-group>
                <b-button variant="outline-info" @click="diseaseComparisonCategory = 'disease-all'">All Human Diseases</b-button>
                <b-button variant="outline-info" @click="diseaseComparisonCategory = 'disease-specific'">Specific Disease(s)</b-button>
              </b-button-group>
            </b-form-group>
            <div v-if="diseaseComparisonCategory == 'disease-specific'">
              <monarch-autocomplete
                :home-search="false"
                :defined-categories="searchCompCategories"
                :dynamic-placeholder="placeholderComparisonText"
                @interface="handleDisease"
              />
              <div v-if="diseases.length > 0">
                <p class="current-profile">Current Disease Comparisons</p>
                <div class="flex-container">
                  <div
                    v-for="(disease, index) in diseases"
                    :key="index"
                    class="m-1 group-badge-phenotypes"
                  >
                    <div class="btn-group" role="group">
                      <button class="btn btn-sm btn-info more-info">
                        <strong>{{ disease.match }}</strong> | {{ disease.curie }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-info pop-phenotype"
                        @click="popDisease(index)"
                      >
                        <strong>x</strong>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="comparisonCategory === 'phenotypes'">
            <b-form-group class="center-text">
              <b-button-group>
                <b-button variant="outline-info" @click="phenotypeComparisonCategory = 'phenotypes-build'">Search & Build</b-button>
                <b-button variant="outline-info" @click="phenotypeComparisonCategory = 'phenotypes-list'">I have a phenotype list</b-button>
              </b-button-group>
            </b-form-group>
            <div v-if="phenotypeComparisonCategory == 'phenotypes-build'">
              <monarch-autocomplete
                :home-search="false"
                :allowed-prefixes="acceptedPrefixes"
                :defined-categories="searchPhenoCategories"
                :dynamic-placeholder="phenoSearchPH"
                @interface="handlePhenotypes"
              />
              *Non-phenotype entities will automatically be mapped to their associated phenotypes.
            </div>
            <div v-if="phenotypeComparisonCategory == 'phenotypes-list'">
              <b-form-textarea
                id="textarea1"
                v-model="phenoComparisonCurieList"
                :rows="3"
                :max-rows="6"
                placeholder="Enter a comma separated list of prefixed phenotype ids e.g. HP:0000322"
                class="my-2"
              />
              <div
                v-if="phenoComparisonCurieList"
                class="btn btn-outline-info submit"
                @click="getPhenotypesFromEntityList"
              >
                Confirm Phenotype List
              </div>
              <b-alert
                :show="showPhenotypeAlert"
                variant="danger"
                class="my-2"
                dismissible
                @dismissed="showPhenotypeAlert=false"
              >
                Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype term id's from the Human Phenotype Ontology (e.g.
                HP:0000002)
              </b-alert>
            </div>
            <div v-if="phenotypeComparison.length > 0" class="flex-container">
              <b-button
                :class="showComparisonCollapse ? 'collapsed' : null"
                :aria-expanded="showComparisonCollapse ? 'true' : 'false'"
                variant="light"
                aria-controls="collapse-4"
                class="m-1 current-phenotype-profile"
                @click="showComparisonCollapse = !showComparisonCollapse">
                <i v-if="showComparisonCollapse" class="fa fa-eye" aria-hidden="true"/>
                <i v-if="!showComparisonCollapse" class="fa fa-eye-slash" aria-hidden="true"/>
                &nbsp;Comparison Phenotype Profile ( {{ phenotypeComparison.length }} phenotypes )
              </b-button>
              <b-collapse id="collapse-phenotypes" v-model="showComparisonCollapse" class="flex-container">
                <div
                  v-for="(phenotype, index) in phenotypeComparison"
                  :key="index"
                  class="m-1 group-badge-phenotypes"
                >
                  <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-info more-info">
                      <strong>{{ phenotype.match }}</strong> | {{ phenotype.curie }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-info pop-phenotype"
                      @click="popPhenotype(index)"
                    >
                      <strong>x</strong>
                    </button>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
          <div v-if="determineFinished()" class="run-analysis">
            <button class="btn btn-outline-success" @click="runPhenogridAnalysis()">
              Run Similarity Analysis
            </button>
          </div>
        </div>
      </div>
      <!-- End of Step 2 Comparison Profile -->
      <div class="col-1"/>
    </div>
    <!--results below here based on path chosen-->
    <div v-if="showPhenogrid" class="results">
      <div class="row">
        <div class="col-1"/>
        <div class="col-10 card">
          <h4 class="current-profile">Similarity Results</h4>
          <b-button variant="outline-dark" class="btn-sm edit-profile" @click="currentStep = 1; showCollapse = true; showPhenogrid = false; clearComparisonCategory();">Back</b-button>
          <br>
          <pheno-grid
            :x-axis="xAxis"
            :y-axis="yAxis"
            :index="pgIndex"
            :mode="mode"
          />
        </div>
        <div class="col-1"/>
        <div class="col-1"/>
        <div class="col-10 card card-body">
          <phenotypes-table :phenotypes="phenotypes"/>
        </div>
        <div class="col-1"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import * as biolinkService from '@/api/BioLink';
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
      phenoSearchPH: 'Search by phenotype, disease or gene...',
      placeholderComparisonText: '',
      searchPhenoCategories: ['phenotype', 'disease', 'gene'],
      searchCompCategories: [],
      targetGeneGroups: [
        { value: null, text: 'Select by taxon' },
        { value: 'mouse', text: 'Mouse (genes)' },
        { value: 'zebrafish', text: 'Zebrafish (genes)' },
        { value: 'ff', text: 'Fruit fly (genes)' },
        { value: 'worm', text: 'Nematode (genes)' }
      ],
      selectedGeneGroup: null,
      currentStep: 1,
      currentSubStep: 1,
      comparisonCategory: '',
      geneComparisonCategory: '',
      diseaseComparisonCategory: '',
      phenotypeComparisonCategory: '',
      showCollapse: true,
      showComparisonCollapse: true,
      showPhenogrid: false,
      pgIndex: 0,
      rejectedPhenotypeCuries: [],
      rejectedGeneCuries: [],
      showPhenotypeAlert: false,
      phenoCurieList: '',
      phenoComparisonCurieList: '',
      geneCurieList: '',
      messages: [],
      phenotypes: [],
      phenotypeComparison: [],
      genes: [],
      diseases: [],
      selectedGroups: [],
      mode: 'search',
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
      groupOptions: {
        'human': {
          text: 'Homo sapiens',
          groupId: '9606',
          groupName: 'Homo sapiens'
        },
        'mouse': {
          text: 'Mus musculus (genes)',
          groupId: '10090',
          groupName: 'Mus musculus'
        },
        'zebrafish': {
          text: 'Danio rerio (genes)',
          groupId: '7955',
          groupName: 'Danio rerio'
        },
        'ff': {
          text: 'Drosophila melanogaster (genes)',
          groupId: '7227',
          groupName: 'Drosophila melanogaster'
        },
        'worm': {
          text: 'Caenorhabditis elegans (genes)',
          groupId: '6239',
          groupName: 'Caenorhabditis elegans'
        },
      }
    };
  },
  computed: {
    showComparableList() {
      let show = false;
      if (this.phenotypes.length) {
        if (this.genes.length) {
          show = true;
        }
      }
      return show;
    }
  },
  watch: {
    comparisonCategory(category) {
      // Depending on second category, we change text.
      if (category === 'disease') {
        this.placeholderComparisonText = 'Search a disease to compare to your profile.';
        this.searchCompCategories = ['disease'];
      } else if (category === 'gene') {
        this.placeholderComparisonText = 'Search a gene to compare to your profile.';
        this.searchCompCategories = ['gene'];
      }
    }
  },
  created() {
    if (this.$route.params.phenotypes) {
      this.phenoCurieList = this.$route.params.phenotypes;
      if (this.phenoCurieList.length > 0) {
        this.currentSubStep = 3;
      }
    }
  },
  methods: {
    determineFinished() {
      // all
      if (this.comparisonCategory === 'all') {
        return true;
      } if (this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'gene-group'
              && this.selectedGeneGroup != null) {
        // Selected gene groups and selected a group
        return true;
      }
      return (this.geneCustomPathValid() || this.diseasePathValid() || this.phenotypePathValid());
    },
    // Resetting step2 comparison profile
    clearComparisonCategory() {
      this.comparisonCategory = '';
      this.genes = [];
      this.rejectedGeneCuries = [];
      this.diseases = [];
      this.geneComparisonCategory = '';
      this.diseaseComparisonCategory = '';
      this.phenotypeComparison = [];
      this.phenotypeComparisonCategory = '';
      this.selectedGeneGroup = null;
    },
    popPhenotype(ind) {
      if(this.comparisonCategory === 'phenotypes'){
        this.phenotypeComparison.splice(ind, 1);
      } else {
        this.phenotypes.splice(ind, 1);
      }
    },
    popGene(ind) {
      this.genes.splice(ind, 1);
    },
    popDisease(ind) {
      this.diseases.splice(ind, 1);
    },
    // Creates a list of phenotypes and stores them in phenotypes after a call using autocomplete
    // or in phenotypeComparison if we are on step 2
    handlePhenotypes(payload) {
      if (payload.curie.includes('MONDO')) {
        this.fetchPhenotypes(payload.curie, 'disease');
      } else if (payload.curie.includes('HGNC')) {
        this.fetchPhenotypes(payload.curie, 'gene');
      } else if (this.comparisonCategory === 'phenotypes') {
        this.phenotypeComparison.push(payload);
      } else {
        this.phenotypes.push(payload);
      }
    },
    // Creates a list of genes returned from autocomplete
    handleGenes(payload) {
      this.genes.push(payload);
    },
    // Creates a list of diseases returned from autocomplete
    handleDisease(payload) {
      if (payload.curie.includes('MONDO')) {
        this.diseases.push(payload);
      }
    },
    phenotypePathValid() {
      return this.comparisonCategory === 'phenotypes' && (this.phenotypeComparisonCategory === 'phenotypes-build' || this.phenotypeComparisonCategory === 'phenotypes-list') && this.phenotypeComparison.length > 0;
    },
    diseasePathValid() {
      return this.comparisonCategory === 'disease' && (this.diseaseComparisonCategory === 'disease-specific' && this.diseases.length > 0) || this.diseaseComparisonCategory === 'disease-all';
    },
    geneCustomPathValid() {
      return this.comparisonCategory === 'gene' && (this.geneComparisonCategory === 'custom-build' || this.geneComparisonCategory === 'custom-list') && this.genes.length > 0;
    },
    // Run Analysis to generate phenogrid and phenotable
    // conditions must be met for a workflow of this tool
    runPhenogridAnalysis() {
      this.xAxis = [];
      this.yAxis = [];
      this.pgIndex = 0;
      if (this.comparisonCategory === 'all' && this.phenotypes.length) {
        // Search
        this.mode = 'search';
        Object.keys(this.groupOptions).forEach((key) => {
          this.xAxis.push(this.groupOptions[key]);
        });
      } else if (this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'gene-group'
              && this.selectedGeneGroup != null) {
        // Selected gene groups and selected a group
        this.mode = 'search';
        const taxon = this.groupOptions[this.selectedGeneGroup];
        this.xAxis.push(taxon);
      } else if (this.geneCustomPathValid()) {
        // A list of genes
        this.mode = 'compare';
        this.genes.map(elem => this.xAxis.push([elem.curie]));
      } else if (this.diseasePathValid()) {
        if (this.diseaseComparisonCategory === 'disease-all') {
          this.mode = 'search';
          this.xAxis.push(this.groupOptions.human);
        } else {
          // a list of diseases
          this.mode = 'compare';
          this.diseases.map(elem => this.xAxis.push([elem.curie]));
        }
      } else if (this.phenotypePathValid()) {
        // / A list of phenotypes
        this.mode = 'compare';
        this.phenotypeComparison.map(elem => this.xAxis.push([elem.curie]));
      }

      this.phenotypes.forEach(elem => this.yAxis.push({
        id: elem.curie,
        term: elem.match
      }));

      this.pgIndex += 1;
      this.showPhenogrid = true;
    },
    getPhenotypesFromEntityList() {
      this.rejectedPhenotypeCuries = [];
      let curieList = [];
      if (this.comparisonCategory === 'phenotypes') {
        this.phenotypeComparison = [];
        curieList = this.phenoComparisonCurieList;
      } else {
        this.phenotypes = [];
        curieList = this.phenoCurieList;
      }
      curieList.split(',').forEach(async (elem) => {
        const elemTrimmed = elem.trim();
        const prefix = elemTrimmed.split(':')[0];
        if (this.acceptedPrefixes.includes(prefix)) {
          await this.fetchLabel(elemTrimmed, 'phenotype');
        } else {
          this.rejectedPhenotypeCuries.push(elemTrimmed);
          this.showPhenotypeAlert = true;
        }
      });
    },
    getGenesFromList() {
      this.rejectedGeneCuries = [];
      this.geneCurieList.split(',').forEach((elem) => {
        const elemTrimmed = elem.trim();
        const prefix = elemTrimmed.split(':')[0];
        if (this.acceptedPrefixes.includes(prefix)) {
          this.fetchLabel(elemTrimmed, 'gene');
        } else {
          this.rejectedGeneCuries.push(elemTrimmed);
        }
      });
    },
    convertGenes(elem) {
      const geneData = elem.data;
      const gene = {
        curie: geneData.id,
        match: geneData.label
      };
      const exists = this.genes.filter(data => data.curie === gene.curie);
      if (exists.length === 0) {
        this.genes.push(gene);
      }
    },
    convertPhenotypes(elem) {
      if (this.comparisonCategory === 'phenotypes') {
        this.phenotypeComparison.push({
          curie: elem.data.id,
          match: elem.data.label
        });
      } else {
        this.phenotypes.push({
          curie: elem.data.id,
          match: elem.data.label
        });
      }
    },
    async fetchLabel(curie, curieType) {
      const that = this;
      try {
        const searchResponse = await biolinkService.getNodeLabelByCurie(curie);
        if (curieType === 'phenotype') {
          this.convertPhenotypes(searchResponse);
        } else if (curieType === 'gene') {
          this.convertGenes(searchResponse);
        }
      } catch (e) {
        that.dataError = e;
        this.rejectedGeneCuries.push(curie);
        console.log('BioLink Error', e);
      }
    },
    async fetchPhenotypes(curie, nodeIdentifier) {
      const that = this;
      try {
        const searchResponse = await biolinkService.getNodeAssociations(nodeIdentifier, curie, 'phenotype');
        const phenotypeComparisonRef = this.phenotypeComparison;
        const phenotypeRef = this.phenotypes;
        const categoryRef = this.comparisonCategory;
        searchResponse.data.associations.forEach((elem) => {
          if (categoryRef === 'phenotypes') {
            phenotypeComparisonRef.push({
              curie: elem.object.id,
              match: elem.object.label
            });
          } else {
            phenotypeRef.push({
              curie: elem.object.id,
              match: elem.object.label
            });
          }
        });
      } catch (e) {
        that.dataError = e;
        console.log('BioLink Error', e);
      }
    },
  }
};
</script>

<style lang="scss">
  @import "~@/style/variables";

  .center-text {
    text-align: center;
  }
  
  .group-badge {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .group-badge-phenotypes .pop-phenotype {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
  }

  .group-badge-phenotypes .more-info {
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

  .step-1-btn-group {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .confirm-profile{
    max-width: 200px;
    width: 100%;
    margin-top: 2rem;
    color: #17a2b8;
    border-color: #17a2b8;
  }

  .reset-profile {
    max-width: 200px;
    width: 100%;
    margin-top: 2rem;
    color: #17a2b8;
    border-color: #17a2b8;
    margin-left: 1rem;
  }

  .comparison-category-select {
    text-align: center;
  }

  .comparison-category-edit {
    padding: 0.1rem 0.5rem;
  }

  .edit-profile{
    max-width: 200px;
    width: 100%;
    align-self: flex-start;
  }

  .current-profile {
    color: #888888;
    text-align: center;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .current-phenotype-profile {
    color: #888888;
    flex: 0 0 100%;
    margin-top: 25px;
    cursor: pointer;
    font-size: 1.2rem;

    & .fa {
      margin-left: 1rem;
    }

    &.collapsed > .when-opened, &:not(.collapsed) > .when-closed {
      display: none;
    }

    &:hover {
      opacity: 0.8;
    }

    & #collapse-phenotypes{
      margin-top: 1rem;
    }
  }

  .run-analysis {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .edit-comparison {
    align-self: flex-end;
  }

  .submit {
    cursor: pointer;
  }
</style>

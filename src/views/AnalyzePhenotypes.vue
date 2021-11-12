<template>
  <div class="container-fluid monarch-view">
    <div class="row">
      <div class="offset-2 col-8 text-center">
        <h2 class="page-title">
          Phenotype Profile Search
        </h2>
        <p>
          This Phenotype Profile Search enables you to find phenotypically similar diseases or genes in a variety of organisms, then visualize
          their overlap. Begin by constructing a "profile" (a collection of phenotypes) then create a comparison profile.
        </p>
      </div>
    </div>
    <div v-if="!showPhenogrid" class="row">
      <div class="col-1" />
      <!-- Step 1 of Phenotype profile search -->
      <div class="col-10 card card-body step-1">
        <div v-if="currentStep === 1">
          <b-button
            v-if="currentSubStep !== 1"
            class="comparison-category-edit"
            variant="outline-info"
            @click="goBack()"
          >
            <i class="fa fa-chevron-left edit-comparison" aria-hidden="true" /> Go Back
          </b-button>
          <b-button
            v-b-modal.help-one
            class="comparison-category-edit help-btn"
            variant="info"
          >
            <i class="fa fa-info-circle edit-comparison" aria-hidden="true" /> Help
          </b-button>
          <h5 class="text-center step-title">
            1. Create a Profile of Phenotypes
          </h5>
          <div v-if="currentSubStep === 1" class="center-text">
            <h6 class="center-text">
              Do you have a phenotype list you would like to paste?
            </h6>
            <b-form-group>
              <b-button-group>
                <b-button variant="outline-info" @click="currentSubStep = 2">
                  Yes
                </b-button>
                <b-button variant="outline-info" @click="currentSubStep = 3">
                  No; I'll need some help
                </b-button>
              </b-button-group>
            </b-form-group>
          </div>
          <div v-if="currentSubStep === 2">
            <b-form-textarea
              id="textarea1"
              v-model="phenoCurieList"
              :rows="3"
              :max-rows="6"
              placeholder="Please enter comma seperated phenotype term identifiers from the Human Phenotype Ontology (e.g. HP:0000322, HP:0001166, HP:0001238)"
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
              Error: '{{ rejectedPhenotypeCuries }}' Please ensure your list is comma seperated and the id's are valid <a target="_blank" href="https://hpo.jax.org">HPO</a> id's.
            </b-alert>
          </div>
          <div v-if="currentSubStep === 3" class="center-text">
            <b-form-group>
              <b-button-group>
                <b-button variant="outline-info" @click="currentSubStep = 4">
                  Generate a list from a gene
                </b-button>
                <b-button variant="outline-info" @click="currentSubStep = 5">
                  Generate a list from a disease
                </b-button>
              </b-button-group>
            </b-form-group>
          </div>
          <div v-if="currentSubStep === 4">
            <monarch-autocomplete
              :home-search="false"
              :search-filters="searchFilters"
              :defined-categories="geneOnlyCategory"
              :dynamic-placeholder="'Search by gene...'"
              @interface="handlePhenotypes"
            />
            <small>*Non-phenotype entities will automatically be mapped to their associated phenotypes. </small>
          </div>
          <div v-if="currentSubStep === 5">
            <monarch-autocomplete
              :home-search="false"
              :search-filters="searchFilters"
              :defined-categories="diseaseOnlyCategory"
              :dynamic-placeholder="'Search by disease...'"
              @interface="handlePhenotypes"
            />
            <small>*Non-phenotype entities will automatically be mapped to their associated phenotypes. </small>
          </div>
        </div>
        <div v-if="phenotypes.length && !showPhenogrid" class="flex-container">
          <b-button
            :class="showCollapse ? 'collapsed' : null"
            :aria-expanded="showCollapse ? 'true' : 'false'"
            variant="light"
            aria-controls="collapse-4"
            class="m-1 current-phenotype-profile"
            @click="showCollapse = !showCollapse"
          >
            <i
              v-if="showCollapse"
              v-b-tooltip.hover
              class="fa fa-eye"
              title="Hide your profile"
              aria-hidden="true"
            />
            <i
              v-if="!showCollapse"
              v-b-tooltip.hover
              class="fa fa-eye-slash"
              title="Show your profile"
              aria-hidden="true"
            />
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
            @click="currentStep = 2; showCollapse = false"
          >
            Confirm Profile
          </b-button>
          <b-button
            v-if="currentStep === 1 && phenotypes.length"
            variant="outline-primary"
            class="reset-profile"
            @click="phenotypes = []; currentSubStep = 1;"
          >
            Reset Profile
          </b-button>
          <b-button
            v-if="currentStep === 2 && phenotypes.length"
            variant="outline-dark"
            class="edit-profile"
            @click="currentStep = 1; clearComparisonCategory"
          >
            Edit Profile
          </b-button>
        </div>
      </div>
      <!-- end of step 1 -->
      <div class="col-1" />
    </div>

    <!-- Step 2 Comparison Profile -->
    <div v-if="(currentStep === 2 || currentStep === 3) && !showPhenogrid" class="row py-2">
      <div class="col-1" />
      <div class="col-10 card card-body">
        <div>
          <b-button
            v-if="comparisonCategory"
            class="comparison-category-edit"
            variant="outline-info"
            @click="clearComparisonCategory"
          >
            <i class="fa fa-chevron-left edit-comparison" aria-hidden="true" /> Go Back
          </b-button>
          <b-button
            v-b-modal.help-two
            class="comparison-category-edit help-btn"
            variant="info"
          >
            <i class="fa fa-info-circle edit-comparison" aria-hidden="true" /> Help
          </b-button>
          <h5 class="step-title center-text">
            2. What do you want to compare against?
          </h5>
        </div>
        <div class="comparison-category-select center-text">
          <div v-if="!comparisonCategory" class="center-text">
            <b-form-group>
              <b-button-group>
                <b-button variant="outline-info" @click="comparisonCategory = 'everything'">
                  Show me everything
                </b-button>
                <b-button variant="outline-info" @click="comparisonCategory = 'custom'">
                  I know what I want to compare
                </b-button>
              </b-button-group>
            </b-form-group>
          </div>
        </div>
        <div v-if="comparisonCategory === 'everything'" class="center-text">
          <b-form-group>
            <b-button-group>
              <b-button variant="outline-info" @click="everythingCategory = 'everything-genes'">
                all matching genes
              </b-button>
              <b-button variant="outline-info" @click="everythingCategory = 'everything-diseases'">
                all matching diseases
              </b-button>
            </b-button-group>
          </b-form-group>
        </div>
        <div v-if="everythingCategory === 'everything-genes' && comparisonCategory === 'everything'" class="center-text">
          <b-form-select v-model="selectedGeneGroup" class="gene-group-select" :options="targetGeneGroups" />
        </div>
        <div v-if="comparisonCategory === 'custom'" class="text-center">
          <b-button-group>
            <b-button variant="outline-info" @click="customCategory = 'gene'">
              a specific gene
            </b-button>
            <b-button variant="outline-info" @click="customCategory = 'disease'">
              a specific disease
            </b-button>
            <b-button variant="outline-info" @click="customCategory = 'phenotypes'">
              I will paste a comparison list of phenotypes
            </b-button>
          </b-button-group>
        </div>
        <div v-if="customCategory === 'gene'">
          <br>
          <monarch-autocomplete
            :home-search="false"
            :defined-categories="geneOnlyCategory"
            :search-filters="searchFilters"
            :dynamic-placeholder="'Search for a gene...'"
            @interface="handleGenes"
          />
          <div v-if="genes.length > 0">
            <p class="current-profile">
              Current Gene Comparisons
            </p>
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
        <div v-if="customCategory === 'disease'">
          <br>
          <monarch-autocomplete
            :home-search="false"
            :defined-categories="diseaseOnlyCategory"
            :search-filters="searchFilters"
            :dynamic-placeholder="'Search for a disease...'"
            @interface="handleDisease"
          />
          <div v-if="diseases.length > 0">
            <p class="current-profile">
              Current Disease Comparisons
            </p>
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
        <div v-if="customCategory === 'phenotypes'">
          <div>
            <b-form-textarea
              id="textarea1"
              v-model="phenoComparisonCurieList"
              :rows="3"
              :max-rows="6"
              placeholder="Please enter comma seperated phenotype term identifiers from the Human Phenotype Ontology (e.g. HP:0000322, HP:0001166, HP:0001238)"
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
              Error: '{{ rejectedPhenotypeCuries }}' Please ensure your list is comma seperated and the id's are valid <a target="_blank" href="https://hpo.jax.org">HPO</a> id's.
            </b-alert>
          </div>
          <div v-if="phenotypeComparison.length > 0" class="flex-container">
            <b-button
              :class="showComparisonCollapse ? 'collapsed' : null"
              :aria-expanded="showComparisonCollapse ? 'true' : 'false'"
              variant="light"
              aria-controls="collapse-4"
              class="m-1 current-phenotype-profile"
              @click="showComparisonCollapse = !showComparisonCollapse"
            >
              <i
                v-if="showComparisonCollapse"
                v-b-tooltip.hover
                class="fa fa-eye"
                title="Hide your profile"
                aria-hidden="true"
              />
              <i
                v-if="!showComparisonCollapse"
                v-b-tooltip.hover
                class="fa fa-eye-slash"
                title="Show your profile"
                aria-hidden="true"
              />
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
      <!-- End of Step 2 Comparison Profile -->
      <div class="col-1" />
    </div>
    <!--results below here based on path chosen-->
    <div v-if="showPhenogrid" class="results">
      <div class="row">
        <div class="col-1" />
        <div class="col-10 card">
          <h4 class="current-profile">
            Similarity Results
          </h4>
          <b-button variant="outline-dark" class="btn-sm edit-profile" @click="currentStep = 1; showCollapse = true; showPhenogrid = false; clearComparisonCategory();">
            Back
          </b-button>
          <br>
          <pheno-grid
            :x-axis="xAxis"
            :y-axis="yAxis"
            :index="pgIndex"
            :mode="mode"
          />
        </div>
        <div class="col-1" />
        <div class="col-1" />
        <div class="col-10 card card-body">
          <phenotypes-table :mode="mode" :compare="xAxis" :source="yAxis" />
        </div>
        <div class="col-1" />
      </div>
    </div>
    <b-modal
      id="help-one"
      size="xl"
      title="Creating Starting Profile"
      ok-only
    >
      <p>To begin, you can create a profile by pasting a list of phenotypes (<a href="https://hpo.jax.org" target="_blank">Human Phenotype Ontology</a>) and confirming your profile.</p>
      <div class="text-center">
        <img src="../assets/img/first-comparison.gif">
      </div>
      <br>
      <p>
        As an alternative you can build a profile of phenotypes by choosing a gene or disease. The associated phenotypes to those entities will
        be populated for you.
      </p>
      <div class="text-center">
        <img src="../assets/img/first-comparison2.gif">
      </div>
    </b-modal>
    <b-modal
      id="help-two"
      size="xl"
      title="Creating Comparison Profile"
      ok-only
    >
      <h5>The next step is to choose what to compare your profile to. </h5>
      <p>You may choose to conduct a blanket search by selecting either all genes from a single species or all human diseases. Once you make a selection, you may run the analysis.</p>
      <div class="text-center">
        <img src="../assets/img/second-comparison.gif">
      </div>
      <br>
      <p>
        For a more fine grained search, you can again build a profile by selecting a specific disease or gene, as well as pasting another list of phenotypes.
        Finally, you can run the analysis.
      </p>
      <div class="text-center">
        <img src="../assets/img/second-comparison2.gif">
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import * as biolinkService from '@/api/BioLink';
import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';
import PhenoGrid from '@/components/PhenoGrid.vue';
import PhenotypesTable from '@/components/PhenotypesTable.vue';

Vue.use(VueFormWizard);

export default {
  name: 'AnalyzePhenotypes',
  components: {
    'monarch-autocomplete': MonarchAutocomplete,
    'pheno-grid': PhenoGrid,
    'phenotypes-table': PhenotypesTable,
  },
  data() {
    return {
      acceptedPrefixes: [
        'MONDO',
        // genes
        'NCBIGene',
        'HGNC',
        'MGI',
        'ZFIN',
        'FlyBase',
        'RGD',
        'WormBase',
        'Xenbase',
        // phenotypes
        'HP', // human
        'MP', // mammal (but really mouse, rat)
        'ZP', // zebrafish
        'FBbt', // fruit fly
        'CL', // Cell ontology converted phenotypes (worm)
        'WBPhenotype', // worm
      ],
      // Filter to prevent diseases without phenotypes and most genes without phenotypes
      // We can't specify human (HGNC) because phenotypes are usually inferred
      // across diseases
      searchFilters: [
        '(category:phenotype OR (category:gene AND (has_phenotype:true OR prefix:HGNC)) ' +
        '(category:disease AND has_phenotype:true))',
      ],
      phenoSearchPH: 'Search by phenotype, disease or gene...',
      placeholderComparisonText: '',
      searchPhenoCategories: ['phenotype', 'disease', 'gene'],
      geneOnlyCategory: ['gene'],
      diseaseOnlyCategory: ['disease'],
      genePrefixes: [
        'NCBIGene',
        'HGNC',
        'MGI',
        'ZFIN',
        'FlyBase',
        'RGD',
        'WormBase',
        'Xenbase',
      ],
      diseasePrefixes: ['MONDO'],
      searchCompCategories: [],
      targetGeneGroups: [
        { value: null, text: 'Select by taxon' },
        { value: 'mouse', text: 'Mouse (genes)' },
        { value: 'zebrafish', text: 'Zebrafish (genes)' },
        { value: 'ff', text: 'Fruit fly (genes)' },
        { value: 'worm', text: 'Nematode (genes)' },
        { value: 'frog', text: 'Frog (genes)' },
      ],
      selectedGeneGroup: null,
      currentStep: 1,
      currentSubStep: 1,
      comparisonCategory: '',
      customCategory: '',
      everythingCategory: '',
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
        'frog': {
          text: 'Xenopus (genes)',
          groupId: '8353',
          groupName: 'Xenopus'
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
  created() {
    if (this.$route.params.phenotypes) {
      this.phenoCurieList = this.$route.params.phenotypes;
      if (this.phenoCurieList.length > 0) {
        this.currentSubStep = 2;
        this.getPhenotypesFromEntityList();
      }
    }
  },
  methods: {

    goBack() {
      this.phenotypes = [];
      if (this.currentSubStep === 4 || this.currentSubStep === 5) {
        this.currentSubStep = 3;
        return;
      }
      this.currentSubStep = 1;
    },
    determineFinished() {
      // all
      if (this.comparisonCategory === 'all') {
        return true;
      }
      return (this.geneCustomPathValid() || this.diseaseCustomPathValid() ||
              this.phenotypePathValid() || this.everythingPathGenesValid() ||
              this.everythingPathDiseasesValid());
    },
    // Resetting step2 comparison profile
    clearComparisonCategory() {
      this.comparisonCategory = '';
      this.genes = [];
      this.rejectedGeneCuries = [];
      this.diseases = [];
      this.phenotypeComparison = [];
      this.selectedGeneGroup = null;
      this.everythingCategory = '';
      this.customCategory = '';
      this.phenoComparisonCurieList = '';
    },
    popPhenotype(ind) {
      if (this.comparisonCategory === 'phenotypes') {
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
      const prefix = payload.curie.split(':')[0];
      if (prefix === 'MONDO') {
        this.fetchPhenotypes(payload.curie, 'disease');
      } else if (this.genePrefixes.includes(prefix)) {
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
    everythingPathGenesValid() {
      return this.comparisonCategory === 'everything' && this.everythingCategory === 'everything-genes' && this.selectedGeneGroup != null;
    },
    everythingPathDiseasesValid() {
      return this.comparisonCategory === 'everything' && this.everythingCategory === 'everything-diseases';
    },
    diseaseCustomPathValid() {
      return this.comparisonCategory === 'custom' && this.customCategory === 'disease' && this.diseases.length > 0;
    },
    geneCustomPathValid() {
      return this.comparisonCategory === 'custom' && this.customCategory === 'gene' && this.genes.length > 0;
    },
    phenotypePathValid() {
      return this.comparisonCategory === 'custom' && this.customCategory === 'phenotypes' && this.phenotypeComparison.length > 0;
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
      } else if (this.everythingPathGenesValid()) {
        // Selected gene groups and selected a group
        this.mode = 'search';
        const taxon = this.groupOptions[this.selectedGeneGroup];
        this.xAxis.push(taxon);
      } else if (this.geneCustomPathValid()) {
        // A list of genes
        this.mode = 'compare';
        this.genes.map(elem => this.xAxis.push([elem.curie]));

      } else if (this.everythingPathDiseasesValid()) {
        this.mode = 'search';
        this.xAxis.push(this.groupOptions.human);
      } else if (this.diseaseCustomPathValid()) {
        // // a list of diseases
        this.mode = 'compare';
        this.diseases.map(elem => this.xAxis.push([elem.curie]));
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
      this.showPhenotypeAlert = false;
      let curieList = [];
      if (this.customCategory === 'phenotypes') {
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
      if (this.customCategory === 'phenotypes') {
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
        // console.log('BioLink Error', e);
      }
    },
    async fetchPhenotypes(curie, nodeIdentifier) {
      const that = this;
      try {
        let params = new URLSearchParams();
        params = {
          'direct': true
        };
        const searchResponse = await biolinkService.getNodeAssociations(
          nodeIdentifier, curie, 'phenotype', null, params
        );
        const phenotypeComparisonRef = this.phenotypeComparison;
        const phenotypeRef = this.phenotypes;
        const categoryRef = this.customCategory;
        searchResponse.data.associations.forEach((elem) => {
          if (categoryRef === 'phenotypes' && !elem.object.id.startsWith('EFO')) {
            phenotypeComparisonRef.push({
              curie: elem.object.id,
              match: elem.object.label
            });
          } else if (!elem.object.id.startsWith('EFO')) {
            phenotypeRef.push({
              curie: elem.object.id,
              match: elem.object.label
            });
          }
        });
      } catch (e) {
        that.dataError = e;
        // console.log('BioLink Error', e);
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

  .card {
    box-shadow: 0px 1px 2px 0px #80808040
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

  .help-btn {
    float: right;
  }

  .submit {
    cursor: pointer;
  }

  .step-title {
    margin-bottom: 1rem;
  }

  .gene-group-select {
    width: fit-content;
  }
</style>

<template>
  <div class="container-fluid monarch-view">
    <div class="row">
      <div class="offset-2 col-8 text-center">
        <h2 class="page-title">Phenotype Profile Search</h2>
        <p>This Phenotype Profile Search enables you search our database using the OwlSim Semantic Similarity analysis
          engine to find phenotypically similar diseases or genes in a variety of organisms, then visualize
          their overlap.</p>
      </div>
    </div>
    <div class="row" v-if="!showPhenogrid">
      <div class="col-1"/>
      <!-- Step 1 of Phenotype profile search -->
      <div class="col-10 card card-body step-1">
        <div v-if="currentStep === 1">
          <h4 class="center-text">1. Create A Profile of Phenotypes</h4>
          <h6 class="center-text">Add your phenotypes by using the search box to get an individual phenotype or a collection of phenotypes by disease or gene. </h6>
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
            @click="getPhenotypesFromEntityList"
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
            Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype term id's from the Human Phenotype Ontology (e.g.
            HP:0000002)
          </b-alert>
        </div>
        <div class="flex-container" v-if="phenotypes.length && !this.showPhenogrid">
          <b-button variant="light"
                    :class="showCollapse ? 'collapsed' : null"
                    :aria-expanded="showCollapse ? 'true' : 'false'"
                    aria-controls="collapse-4"
                    @click="showCollapse = !showCollapse"
                    class="m-1 current-phenotype-profile">
            Current Phenotype Profile ( {{phenotypes.length}} phenotypes )
            <i class="fa fa-chevron-down" v-if="showCollapse" aria-hidden="true"></i>
            <i class="fa fa-chevron-right" v-if="!showCollapse" aria-hidden="true"></i>
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
          <b-button v-if="currentStep === 1 && phenotypes.length" v-on:click="currentStep = 2; showCollapse = false" variant="outline-primary" class="confirm-profile">Confirm Profile</b-button>
          <b-button v-if="currentStep === 1 && phenotypes.length" v-on:click="phenotypes = []" variant="outline-primary" class="reset-profile">Reset Profile</b-button>
          <b-button v-if="currentStep === 2 && phenotypes.length" v-on:click="currentStep = 1; showCollapse = true" variant="outline-dark" class="edit-profile">Edit Profile</b-button>
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
          <h5>What would you like to compare your profile with?</h5>
          <b-form-group>
            <b-button-group>
              <b-button variant="outline-info" v-on:click="comparisonCategory = 'all'">All</b-button>
              <b-button variant="outline-info" v-on:click="comparisonCategory = 'disease'">Disease(s)</b-button>
              <b-button variant="outline-info" v-on:click="comparisonCategory = 'gene'">Gene(s)</b-button>
              <b-button variant="outline-info" v-on:click="comparisonCategory = 'phenotypes'">Phenotype(s)</b-button>
            </b-button-group>
          </b-form-group>
        </div>
        <div v-if="comparisonCategory">
          <h4 class="center-text">
            2. Select your {{comparisonCategory}} profile for comparison
            <b-button class="comparison-category-edit" variant="outline-info" v-on:click="clearComparisonCategory"><i class="fa fa-pencil edit-comparison" aria-hidden="true"></i> Change Category </b-button>
          </h4>
          <div v-if="comparisonCategory === 'gene'">
            <b-form-group class="center-text">
              <b-button-group>
                <b-button variant="outline-info" v-on:click="geneComparisonCategory = 'gene-group'">Taxon Grouped Genes</b-button>
                <b-button variant="outline-info" v-on:click="geneComparisonCategory = 'custom'">Custom</b-button>
              </b-button-group>
            </b-form-group>
            <div v-if="geneComparisonCategory === 'gene-group'">
              <b-form-select v-model="selectedGeneGroup" :options="targetGeneGroups"></b-form-select>
            </div>
            <div v-if="geneComparisonCategory === 'custom'">
              <monarch-autocomplete
                      :home-search="false"
                      :defined-categories="searchCompCategories"
                      :dynamic-placeholder="placeholderComparisonText"
                      @interface="handleGenes"
              />
              <b-form-textarea
                      id="textarea2"
                      v-if="comparisonCategory === 'gene'"
                      v-model="geneCurieList"
                      :rows="3"
                      :max-rows="6"
                      placeholder="Enter a comma separated list of prefixed gene ids from NCBI (e.g. NCBIGene:3845) or HGNC (e.g. HGNC:2176)"
                      class="my-2"
              ></b-form-textarea>
              <div v-if="geneCurieList" class="btn btn-outline-info" @click="getGenesFromList">
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
              <div v-if="genes.length > 0">
                <p class="current-profile">Current Gene Comparisons</p>
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
            <monarch-autocomplete
                    :home-search="false"
                    :defined-categories="searchCompCategories"
                    :dynamic-placeholder="placeholderComparisonText"
                    @interface="handleDisease"
            />
            <div v-if="diseases.length > 0">
              <p class="current-profile">Current Disease Comparisons</p>
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
          <div v-if="comparisonCategory === 'phenotypes'">
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
            @click="getPhenotypesFromEntityList"
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
            Error: '{{ rejectedPhenotypeCuries }}' Please enter phenotype term id's from the Human Phenotype Ontology (e.g.
            HP:0000002)
          </b-alert>
          <div class="flex-container">
            <b-button variant="light"
                    :class="showComparisonCollapse ? 'collapsed' : null"
                    :aria-expanded="showComparisonCollapse ? 'true' : 'false'"
                    aria-controls="collapse-4"
                    @click="showComparisonCollapse = !showComparisonCollapse"
                    class="m-1 current-phenotype-profile">
            Comparison Phenotype Profile ( {{phenotypeComparison.length}} phenotypes )
            <i class="fa fa-chevron-down" v-if="showComparisonCollapse" aria-hidden="true"></i>
            <i class="fa fa-chevron-right" v-if="!showComparisonCollapse" aria-hidden="true"></i>
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
            <button class="btn btn-outline-success" @click="generatePhenogridData()">
              Run Similarity Analysis
            </button>
          </div>
        </div>
      </div>
      <!-- End of Step 2 Comparison Profile -->
      <div class="col-1"/>
    </div>
    <!--results below here based on path chosen-->
    <div class="results" v-if="showPhenogrid">
      <div class="row">
        <div class="col-1"/>
        <div class="col-10 card">
          <p class="current-profile">Similarity Results</p>
          <b-button v-on:click="currentStep = 1; showCollapse = true; showPhenogrid = false;" variant="outline-dark" class="edit-profile">Back</b-button>
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
      phenotypeModal: false,
      selectedPhenotype: {},
      geneModal: false,
      selectedGene: {},
      acceptedPrefixes: ['MONDO', 'HP', 'NCBIGene', 'HGNC'],
      phenoSearchPH: 'Search by phenotype, disease or gene...',
      placeholderComparisonText: '',
      searchPhenoCategories: ['phenotype', 'disease', 'gene'],
      searchCompCategories: ['gene'],
      targetGeneGroups: [
        { value: null, text: "Select by taxon"},
        { value: 'human', text: 'Homo Sapien (genes)' },
        { value: 'mouse', text: 'Mouse (genes)' },
        { value: 'zebrafish', text: 'Zebrafish (genes)' },
        { value: 'ff', text: 'Fruit fly (genes)' },
        { value: 'nematode', text: 'Nematode (genes)'}
      ],
      selectedGeneGroup: null,
      mode: 'search',
      currentStep: 1,
      comparisonCategory: '',
      geneComparisonCategory: '',
      showCollapse: false,
      showComparisonCollapse: false,
      showPhenogrid: false,
      pgIndex: 0,
      rejectedPhenotypeCuries: [],
      rejectedGeneCuries: [],
      showPhenotypeAlert: false,
      phenoCurieList: '',
      geneCurieList: '',
      messages: [],
      phenotypes: [],
      phenotypeComparison: [],
      genes: [],
      diseases: [],
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
          text: 'Homo sapiens',
          value: {
            groupId: '9606',
            groupName: 'Homo sapiens'
          }
        },
        {
          text: 'Mus musculus (genes)',
          value: {
            groupId: '10090',
            groupName: 'Mus musculus'
          }
        },
        {
          text: 'Danio rerio (genes)',
          value: {
            groupId: '7955',
            groupName: 'Danio rerio'
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
      ]
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
      // Category Switching
      if(category === 'disease') {
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
    }

  },
  async mounted() {
    // await this.applyExampleData();
  },

  methods: {
    determineFinished() {
      // all
      if(this.comparisonCategory === 'all'){
        return true;
      } else if(this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'gene-group'
              && this.selectedGeneGroup != null){
        // Selected gene groups and selected a group
        return true;
      } else if(this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'custom' && this.genes.length > 0){
        return true;
      } else if(this.comparisonCategory === 'disease' && this.diseases.length > 0){
        return true; 
      } else if(this.comparisonCategory == 'phenotypes' && this.phenotypeComparison.length > 0){
        return true;
      }
    },

    generateDataForAnalysis() {

    },
    clearComparisonCategory(){
      this.comparisonCategory = '';
      this.genes = [];
      this.rejectedGeneCuries = [];
      this.diseases = [];
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
      } catch (e) {
        that.dataError = e;
        console.log('BioLink Error', e);
      }
    },
    popPhenotype(ind) {
      this.phenotypes.splice(ind, 1);
    },
    popGene(ind) {
      this.genes.splice(ind, 1);
    },
    popDisease(ind) {
      this.diseases.splice(ind,1);
    },
    handlePhenotypes(payload) {
      if (payload.curie.includes('MONDO')) {
        this.fetchPhenotypes(payload.curie, 'disease');
      } else if (payload.curie.includes('HGNC')){
        this.fetchPhenotypes(payload.curie, 'gene');
      } else if(this.comparisonCategory == "phenotypes"){
        this.phenotypeComparison.push(payload);
        return;
      }
      this.phenotypes.push(payload);
    },
    handleGenes(payload) {
      this.genes.push(payload);
    },
    handleDisease(payload) {
      if (payload.curie.includes('MONDO')) {
        this.diseases.push(payload);
      }
    },
    generatePhenogridData() {
      if(this.comparisonCategory === 'all'){
        return true;
      } else if(this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'gene-group'
              && this.selectedGeneGroup != null){
        // Selected gene groups and selected a group
        return true;
      } else if(this.comparisonCategory === 'gene' && this.geneComparisonCategory === 'custom' && this.genes.length > 0){
        this.mode = "compare";
        this.genes.map((elem) => this.xAxis.push(elem.curie));
      } else if(this.comparisonCategory === 'disease' && this.diseases.length > 0){
        return true; 
      } else if(this.comparisonCategory === 'phenotypes' && this.phenotypeComparison.length > 0 ){
        this.mode = "compare";
        this.phenotypeComparison.map((elem) => this.xAxis.push(elem.curie));
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
      this.phenotypes = [];
      this.phenoCurieList.split(',').forEach(async (elem) => {
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
      const exists = this.genes.filter((data) => data.curie === gene.curie);
      if(exists.length === 0){
        this.genes.push(gene);
      }

    },
    convertPhenotypes(elem) {
      const phenoData = elem.data;
      this.phenotypes.push({
        curie: phenoData.id,
        match: phenoData.label
      });
    },

    async applyExampleData() {
      const phenogridExampleData = [
        {
          'id': 'HP:0000174',
          'term': 'Abnormality of the palate'
        },
        {
          'id': 'HP:0000194',
          'term': 'Open mouth'
        },
        {
          'id': 'HP:0000218',
          'term': 'High palate'
        },
        {
          'id': 'HP:0000238',
          'term': 'Hydrocephalus'
        },
        {
          'id': 'HP:0000244',
          'term': 'Brachyturricephaly'
        },
        {
          'id': 'HP:0000272',
          'term': 'Malar flattening'
        },
        {
          'id': 'HP:0000303',
          'term': 'Mandibular prognathia'
        },
        {
          'id': 'HP:0000316',
          'term': 'Hypertelorism'
        },
        {
          'id': 'HP:0000322',
          'term': 'Short philtrum'
        },
        {
          'id': 'HP:0000324',
          'term': 'Facial asymmetry'
        },
        {
          'id': 'HP:0000327',
          'term': 'Hypoplasia of the maxilla'
        },
        {
          'id': 'HP:0000348',
          'term': 'High forehead'
        },
        {
          'id': 'HP:0000431',
          'term': 'Wide nasal bridge'
        },
        {
          'id': 'HP:0000452',
          'term': 'Choanal stenosis'
        },
        {
          'id': 'HP:0000453',
          'term': 'Choanal atresia'
        },
        {
          'id': 'HP:0000470',
          'term': 'Short neck'
        },
        {
          'id': 'HP:0000486',
          'term': 'Strabismus'
        },
        {
          'id': 'HP:0000494',
          'term': 'Downslanted palpebral fissures'
        },
        {
          'id': 'HP:0000508',
          'term': 'Ptosis'
        },
        {
          'id': 'HP:0000586',
          'term': 'Shallow orbits'
        },
        {
          'id': 'HP:0000678',
          'term': 'Dental crowding'
        },
        {
          'id': 'HP:0001156',
          'term': 'Brachydactyly syndrome'
        },
        {
          'id': 'HP:0001249',
          'term': 'Intellectual disability'
        },
        {
          'id': 'HP:0002308',
          'term': 'Arnold-Chiari malformation'
        },
        {
          'id': 'HP:0002676',
          'term': 'Cloverleaf skull'
        },
        {
          'id': 'HP:0002780',
          'term': 'Bronchomalacia'
        },
        {
          'id': 'HP:0003041',
          'term': 'Humeroradial synostosis'
        },
        {
          'id': 'HP:0003070',
          'term': 'Elbow ankylosis'
        },
        {
          'id': 'HP:0003196',
          'term': 'Short nose'
        },
        {
          'id': 'HP:0003272',
          'term': 'Abnormality of the hip bone'
        },
        {
          'id': 'HP:0003307',
          'term': 'Hyperlordosis'
        },
        {
          'id': 'HP:0003795',
          'term': 'Short middle phalanx of toe'
        },
        {
          'id': 'HP:0004209',
          'term': 'Clinodactyly of the 5th finger'
        },
        {
          'id': 'HP:0004322',
          'term': 'Short stature'
        },
        {
          'id': 'HP:0004440',
          'term': 'Coronal craniosynostosis'
        },
        {
          'id': 'HP:0005048',
          'term': 'Synostosis of carpal bones'
        },
        {
          'id': 'HP:0005280',
          'term': 'Depressed nasal bridge'
        },
        {
          'id': 'HP:0005347',
          'term': 'Cartilaginous trachea'
        },
        {
          'id': 'HP:0006101',
          'term': 'Finger syndactyly'
        },
        {
          'id': 'HP:0006110',
          'term': 'Shortening of all middle phalanges of the fingers'
        },
        {
          'id': 'HP:0009602',
          'term': 'Abnormality of thumb phalanx'
        },
        {
          'id': 'HP:0009773',
          'term': 'Symphalangism affecting the phalanges of the hand'
        },
        {
          'id': 'HP:0010055',
          'term': 'Broad hallux'
        },
        {
          'id': 'HP:0010669',
          'term': 'Hypoplasia of the zygomatic bone'
          // Monarch says this EquivalentTo HP:0000272: 'Malar flattening'
        },
        {
          'id': 'HP:0011304',
          'term': 'Broad thumb'
        }
      ];

      this.phenoCurieList = phenogridExampleData.map(function getId(s) {
        return s.id;
      }).join(',');

      this.geneCurieList = 'NCBIGene:3845,HGNC:2176';

      this.selectedGroups = [this.groupOptions[0].value, this.groupOptions[1].value, this.groupOptions[2].value];

      //await this.generatePGDataFromPhenotypeList();
      //await this.generatePGDataFromGeneList();
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
    align-self: flex-end;
  }

  .current-profile {
    color: #888888;
    font-size: 1.2rem;
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
    justify-content: flex-end;
    align-items: flex-end;
    button {
      align-self: flex-end;
    }
  }

  .edit-comparison {
    align-self: flex-end;
  }
</style>

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
              :key="index"
              class="m-1"
            >
              <div
                class="btn-group"
                role="group"
              >
                <button
                  v-b-modal.phenotypeModal
                  class="btn btn-sm btn-info"
                  @click="displayPhenotypeModal(phenotype)"
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

            <b-form-checkbox-group
              id="btnradios1"
              v-model="selectedGroups"
              :options="groupOptions"
              buttons
              button-variant="outline-info"
              size="sm"
              name="selectedGroups"
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
      v-if="selectedGroups.length > 0"
      class="row"
    >
      <div class="col-1"/>
      <div class="col-10 card">
        <div class="p-3">
          <h4>Taxon Groups</h4>
          <div
            v-for="group in selectedGroups"
            :key="group.groupId"
            class="btn-group"
            role="group"
          >
            <div
              class="badge badge-info group-badge p-2"
            >
              {{ group.groupName }}
              (NCBITaxon:{{ group.groupId }})
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
                  v-b-modal.geneModal
                  class="btn btn-sm btn-info"
                  @click="displayGeneModal(gene)"
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


    <b-modal
      id="phenotypeModal"
      v-model="phenotypeModal"
      lazy
      size="xl"
      title="selectedPhenotype.label"
    >
      <div
        slot="modal-title"
        class="w-100"
      >
        <strong>{{ selectedPhenotype.match }}</strong> | {{ selectedPhenotype.curie }}
      </div>
      <div
        v-if="phenotypeModal">
        <local-nav
          :anchor-id="selectedPhenotype.curie"
          @interface="handleReplacePhenotype"
        />
      </div>
    </b-modal>

    <b-modal
      id="geneModal"
      v-model="geneModal"
      lazy
      size="xl"
      title="selectedGene.label"
    >
      <div
        slot="modal-title"
        class="w-100"
      >
        {{ selectedGene.match }} | {{ selectedGene.curie }}
      </div>
      <div
        v-if="geneModal">
        <local-nav
          :anchor-id="selectedGene.curie"
          :anchor-type="'gene'"
          @interface="handleReplaceGene"
        />
      </div>
    </b-modal>
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
      phenotypeModal: false,
      selectedPhenotype: {},
      geneModal: false,
      selectedGene: {},
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
        if (this.genes.length || this.selectedGroups) {
          show = true;
        }
      }
      return show;
    }
  },
  async mounted() {
    await this.applyExampleData();
  },

  methods: {
    displayPhenotypeModal(item) {
      this.selectedPhenotype = item;
    },

    displayGeneModal(item) {
      this.selectedGene = item;
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
        else if (curieType === 'gene') {
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
      this.selectedPhenotype = payload;
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
      this.selectedGene = payload;
    },
    generatePhenogridData() {
      this.showPhenogrid = true;
      if (this.selectedGroups) {
        this.xAxis = this.selectedGroups;
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
    async geneListLookup() {
      this.genes = [];
      this.geneCurieList.split(',').forEach(async (elem) => {
        await this.fetchLabel(`${this.geneCurieType}:${elem.trim()}`, 'gene');
      });
    },
    async generatePGDataFromPhenotypeList() {
      this.rejectedPhenotypeCuries = [];
      this.phenotypes = [];
      this.phenoCurieList.split(',').forEach(async (elem) => {
        const elemTrimmed = elem.trim();
        const prefix = elemTrimmed.split(':')[0];
        if (this.acceptedPrefixes.includes(prefix)) {
          await this.fetchLabel(elemTrimmed, 'phenotype');
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

      await this.generatePGDataFromPhenotypeList();
      await this.generatePGDataFromGeneList();
    },
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

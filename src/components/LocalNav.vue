<template>
  <div>
    <div v-if="!dataFetched">
      Loading Related Terms ...
    </div>
    <div v-else>
      <div class="row border-bottom">
        <div class="col-4">
          <h6>Parent Terms</h6>
        </div>
        <div class="col-4">
          <h6>Equivalent Terms</h6>
        </div>
        <div class="col-4">
          <h6>Child Terms</h6>
        </div>
      </div>

      <div
        v-for="(row, rowIndex) in classRows"
        :key="rowIndex"
        class="row"
      >
        <div
          class="col-4"
        >
          <button
            v-if="row.superclass"
            class="m-1 btn btn-sm btn-info"
            @click="emitSelection(row.superclass.label, row.superclass.id)"
          >
            {{ row.superclass.label }} <br> ({{ row.superclass.id }})
          </button>
        </div>

        <div
          class="col-4"
        >
          <button
            v-if="row.equivalentClass"
            class="m-1 btn btn-sm btn-info"
            @click="emitSelection(row.equivalentClass.label, row.equivalentClass.id)"
          >
            {{ row.equivalentClass.label }} <br> ({{ row.equivalentClass.id }})
          </button>
        </div>

        <div
          class="col-4"
        >
          <button
            v-if="row.subclass"
            class="m-1 btn btn-sm btn-info"
            @click="emitSelection(row.subclass.label, row.subclass.id)"
          >
            {{ row.subclass.label }} <br> ({{ row.subclass.id }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'underscore';
import * as BL from '@/api/BioLink';

export default {
  props: {
    anchorId: {
      type: String,
      required: true
    },
    anchorType: {
      type: String,
      required: false,
      default: 'phenotype'
    },
  },
  data() {
    return {
      equivalentClasses: '',
      rootTerm: '',
      familyData: [],
      subclasses: [],
      siblings: [],
      classRows: [],
      dataFetched: false
    };
  },
  watch: {
    anchorId() {
      this.getCurieRelationships();
    },
  },
  mounted() {
    this.getCurieRelationships();
  },
  methods: {
    async getCurieRelationships() {
      const that = this;
      try {
        const searchResponse = await BL.getNodeSummary(this.anchorId, this.anchorType);
        this.familyData = searchResponse;
        await this.sortRelationships();
        this.dataFetched = true;
      } catch (e) {
        that.dataError = e;
        // console.log('BioLink Error', e);
      }
    },
    emitSelection(termLabel, termId) {
      this.$emit('interface',
        {
          curie: termId,
          match: termLabel,
          root: this.rootTerm.id
        });
    },
    async sortRelationships() {
      this.rootTerm = {
        id: this.familyData.id,
        label: this.familyData.label,
      };

      const neighborhood = await BL.getNeighborhood(this.familyData.id);
      const nodeLabelMap = neighborhood.nodeLabelMap;
      const equivalentClasses = neighborhood.equivalentClasses;
      const superclasses = neighborhood.superclasses;
      const subclasses = neighborhood.subclasses;

      this.superclasses = _.map(_.uniq(superclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      this.subclasses = _.map(_.uniq(subclasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));
      this.equivalentClasses = _.map(_.uniq(equivalentClasses), c => ({
        id: c,
        label: nodeLabelMap[c]
      }));

      const maxRows = Math.max(
        this.superclasses.length,
        this.subclasses.length,
        this.equivalentClasses.length
      );
      this.classRows = [];
      for (let cindex = 0; cindex < maxRows; ++cindex) {
        this.classRows.push({
          superclass: this.superclasses[cindex],
          subclass: this.subclasses[cindex],
          equivalentClass: this.equivalentClasses[cindex],
        });
      }
    }
  }
};
</script>
<style scoped>
  .content {
    width:500px;
    margin:auto;
  }
  .card-header {
    text-align: center;
  }
</style>

<template>
  <div>
    <div v-if="!dataFetched">Loading Related Terms ...</div>
    <div v-else>
      <div class="row border-bottom py-2">
        <div class="col-4"><h5>Parent Terms</h5></div>
        <div class="col-4"><h5>Equivalent Terms</h5></div>
        <div class="col-4"><h5>Child Terms</h5></div>
      </div>

      <div class="row py-2">
        <div
          v-for="superclass in superclasses"
          :key="superclass.id"
          class="col-4"
        >
          <button
            class="p-1 m-1 btn btn-sm btn-info"
            @click="emitSelection(superclass.label, superclass.id)"
          >
            {{ superclass.label }} <br> ({{ superclass.id }})
          </button>
        </div>

        <div
          v-for="sibling in equivalentClasses"
          :key="sibling.id"
          class="col-4"
        >
          <button
            class="p-1 m-1 btn btn-sm btn-info"
            @click="emitSelection(sibling.label, sibling.id)"
          >
            {{ sibling.label }} <br> ({{ sibling.id }})
          </button>
        </div>

        <div
          v-for="subclass in subclasses"
          :key="subclass.id"
          class="col-4"
        >
          <button
            class="p-1 m-1 btn btn-sm btn-info"
            @click="emitSelection(subclass.label, subclass.id)"
          >
            {{ subclass.label }} <br> ({{ subclass.id }})
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
    }
  },
  data() {
    return {
      equivalentClasses: '',
      rootTerm: '',
      familyData: [],
      subclasses: [],
      siblings: [],
      dataFetched: false
    };
  },
  mounted() {
    this.getCurieRelationships();
  },
  methods: {
    async getCurieRelationships() {
      const that = this;
      try {
        const searchResponse = await BL.getNodeSummary(this.anchorId, 'phenotype');
        this.familyData = searchResponse;
        await this.sortRelationships();
        this.dataFetched = true;
      }
      catch (e) {
        that.dataError = e;
        console.log('BioLink Error', e);
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

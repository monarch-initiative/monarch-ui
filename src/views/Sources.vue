<template>
  <div class="container-fluid monarch-view data-sources">
    <h2 class="text-center">Monarch Sources</h2>
      <div class="source-wrapper">
        <div v-for="(source, index) in sortedSource"
            :key="index"
            class="row source-wrapper">
          <div class="offset-1 col-10 source">
              <div class="displayName">
                  <h5>{{ source.sourceDisplayName }}</h5>
              </div>
              <div class="displayName">
                  {{ source.sourceDescription }}
              </div>
              <div class="sourceUsage">
                  <h6>How do we use it?</h6>
                {{source.monarchUsage}}
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as biolinkService from '@/api/BioLink';

export default {
  name: 'Sources',
  data() {
    return {
      sources: [],
    };
  },
  async mounted() {
    this.sources = await biolinkService.getSources();
    this.sources = this.sources.sources;
  },
  computed: {
    sortedSource: function() {
      return this.sources.sort(function(a,b){
          if(a.sourceDisplayName < b.sourceDisplayName) { return -1; }
          if(a.sourceDisplayName > b.sourceDisplayName) { return 1; }
          return 0;
      })
    }
  }
};
</script>

<style lang="scss">
  @import "~@/style/variables";
  .source {
    padding: 15px;
    background-color: $monarch-bg-color;
    color: white;
  }
</style>

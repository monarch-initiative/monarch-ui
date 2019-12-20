<template>
  <div class="container-fluid monarch-view data-sources">
    <h2 class="text-center page-title">Monarch Sources</h2>
    <div class="source-wrapper">
      <div
        v-for="(source, index) in sortedSource"
        :key="index"
        class="row source-wrapper"
      >
        <div class="offset-1 col-10 source">
          <div class="displayName">
            <h5>{{ source.sourceDisplayName }}</h5>
          </div>
          <div class="display-name">
            {{ source.sourceDescription }}
          </div>
          <div v-if="source.monarchUsage" class="source-usage">
            <h6><i>How do we use it?</i></h6>
            {{ source.monarchUsage }}
          </div>
          <div>
            <h6><a :href="source.rdfDownloadUrl">Download RDF</a></h6>
          </div>
          <div>
            <img :src="source.logoUrl + '?raw=true'" >
          </div>
          <div v-for="file in source.sourceFiles">
            {{ file.fileUrl }} retrieved on {{ file.retrievedOn }}
          </div>
          <div class="versions">
            <div class="source-version"/>
            <div class="monarch-version">
              Monarch Ingest Date: {{ source.ingestDate }}
            </div>
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
  computed: {
    sortedSource() {
      return this.sources.slice().sort((a, b) => (
        (a.sourceDisplayName < b.sourceDisplayName) ? -1 : 1));
    }
  },
  async mounted() {
    this.sources = await biolinkService.getSources();
  }
};
</script>

<style lang="scss">
  @import "~@/style/variables";
  .source {
    border: 5px solid $monarch-bg-color;
    padding: 15px;
    color: black;
    margin-bottom: 5px;
  }

  .source-usage {
      margin-top: 15px;
  }

  .versions {
      .monarch-version {
          float: right;
          padding-top: 5px;
          border-top: 2px solid $monarch-bg-color;
          margin-top: 15px;
      }
  }
</style>

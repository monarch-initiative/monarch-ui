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
          <div>
            <h5>{{ source.sourceDisplayName }}</h5>
          </div>

          <div>
            <b-button
              v-b-toggle="'collapse-' + index"
              variant="primary"
              class="btn btn-info"
            >
              More info
            </b-button>
            <b-collapse :id="'collapse-' + index" class="mt-2">
              <b-card>
                <img v-if="source.logoUrl" :src="source.logoUrl" />
                <div class="display-name">
                  {{ source.sourceDescription }}
                </div>
                <div v-if="source.monarchUsage" class="source-info">
                  <h6><i>How do we use it?</i></h6>
                  {{ source.monarchUsage }}
                </div>
                <div v-if="source.rdfDownloadUrl" class="source-info">
                  <h6><a :href="source.rdfDownloadUrl">Download RDF</a></h6>
                </div>
                <div v-if="source.sourceFiles.length > 0" class="source-info">
                  <h6><i>Ingested files:</i></h6>
                </div>
                <div v-for="file in source.sourceFiles" :key="file">
                  <a :href="file.fileUrl">{{ file.fileUrl }}</a>
                  <span v-if="file.retrievedOn">
                    retrieved on {{ file.retrievedOn }}
                  </span>
                </div>
                <template v-if="source.ingestDate">
                  <div class="versions">
                    <div class="monarch-version">
                      Monarch Ingest Date: {{ source.ingestDate }}
                    </div>
                  </div>
                </template>
                <div v-if="source.reusableDataUrl" class="source-info">
                  <h6>
                    License information from the
                    <a :href="source.reusableDataUrl" target="_blank">
                      (Re)usable Data Project
                    </a>
                  </h6>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as biolinkService from "@/api/bio-link";

export default {
  name: "Sources",
  data() {
    return {
      sources: [],
    };
  },
  computed: {
    sortedSource() {
      return this.sources
        .slice()
        .sort((a, b) => (a.sourceDisplayName < b.sourceDisplayName ? -1 : 1));
    },
  },
  async mounted() {
    this.sources = await biolinkService.getSources();
  },
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

.source-info {
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

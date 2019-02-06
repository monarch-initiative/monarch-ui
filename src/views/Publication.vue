<template>
  <div
    class="publication-container">
    <hr>
    <router-link
      v-if="fromLink"
      :to="fromLink">
      Back to {{ fromType }}: {{ fromId }}
    </router-link>
    <hr>

    <template
      v-if="entrezResult">
      <h4
        v-if="entrezResult">
        {{ entrezResult.title }}
      </h4>
      <a
        v-if="pmLink"
        :href="pmLink"
        target="_blank"
        rel="noopener noreferrer">
        <h6>Pubmed {{ fromId }}</h6>
      </a>

      <h5>Date: {{ entrezResult.pubdate }}</h5>
      <h5>Authors:
        {{ entrezResult.authors.map(a => { return a.name; }).join(', ') }}
      </h5>

      <pre
        v-if="entrezResult"
        class="publication-abstract">
        {{ entrezResult.abstract }}
      </pre>

      <!--
      <pre
        v-if="entrezResult">
{{ entrezResult }}
      </pre>
       -->
    </template>
  </div>
</template>

<script>

import * as Entrez from '@/api/Entrez';

export default {
  components: {
  },

  data() {
    return {
      path: null,
      nodeId: null,
      nodeDescription: null,
      fromType: null,
      fromId: null,
      fromLink: null,
      pmLink: null,
      entrezResult: null
    };
  },

  watch: {
    $route(to, _from) {
      // Only fetchData if the path is different.
      // hash changes are currently handled by monarch-tabs.js
      // within the loaded MonarchLegacy component.

      if (to.path !== this.path) {
        this.fetchData();
      }
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const path = this.$route.fullPath;
      this.path = this.$route.path;
      this.nodeId = this.$route.params.id;
      this.fromType = this.$route.params.fromType;
      this.fromId = this.$route.params.fromId;
      if (this.fromType && this.fromId) {
        this.fromLink = `/${this.fromType}/${this.fromId}#literature`;
      }
      // console.log('fetchData', this.nodeId, this.fromType, this.fromId);

      const entrezResult = await Entrez.getPublication(this.nodeId);
      this.entrezResult = entrezResult;
      this.pmLink = entrezResult ? entrezResult.pmLink : null;
    }
  }
};

</script>

<style lang="scss">
@import "~@/style/variables";

.publication-container {
  margin: 10px;
  padding: 10px;
}

.publication-container .publication-abstract {
  margin: 0;
  padding: 10px 15px;
  background: #FAFAFA;
  font-weight: 500;
}
</style>

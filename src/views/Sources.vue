<template>
  <div>
    <br><br>
    <h1>Monarch Sources</h1>
    <div class="container">
      <div class="row border">
        <div class="col-1">  id </div>
        <div class="col-6">  title </div>
        <div class="col-2">  version </div>
        <div class="col-3">  url </div>
      </div>
      <div
        v-for="(source, index) in sources"
        :key="index"
        class="row">
        <div class="col-1"> {{ source.id }}</div>
        <div class="col-6"> {{ source.title }}</div>
        <div class="col-2"> {{ source.meta.version[0] }}</div>
        <div class="col-3">
          <a
            :href="source.url"
            target="_blank">{{ source.url }}
          </a>
        </div>
        <script type="application/ld+json">
          {
          "@context": "http://schema.org",
          "@type": "Dataset",
          "name": "Monarch transformation of {{ source.title }}",
          "description": "Monarch transformation of: {{ source.description }}",
          "url": "{{ source.url }}",
          "includedInDataCatalog": "https://monarchinitiative.org",
          "creator": {
          "@type": "Organization",
          "name": "{{ source.id }}"
          },
          "license": "{{ source.license }}"
          }
        </script>
      </div>
    </div>
  </div>


</template>

<script>
import * as BL from '@/api/BioLink';

export default {
  name: 'Sources',
  data() {
    return {
      sources: [],
    };
  },
  async mounted() {
    this.sources = (await BL.getSources());
    console.log('Num sources=', this.sources);
  },
  // mounted() {
  // }
};
</script>

<style>

</style>

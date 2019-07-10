<template>
  <div>
    <br><br>
    <h2>Monarch Sources</h2>
    <div class="container">
      <div class="row border">
        <div class="col-4">  Source </div>
        <div class="col-4">  Source Version </div>
        <div class="col-4">  Monarch data release date </div>
      </div>
      <div
        v-for="(source, index) in sources"
        :key="index"
        class="row">
        <div class="col-4">
          <a
            :href="source.ttlUrl"
            target="_blank">{{ source.sourceDisplayName }}
          </a>
        </div>
        <div class="col-4"> {{ source.sourceVersion }}</div>
        <div class="col-4"> {{ source.monarchDataReleaseDate }}</div>
        <script type="application/ld+json">
          {
          "@context": "http://schema.org",
          "@type": "Dataset",
          "name": "Monarch transformation of {{ source.sourceDisplayName }}",
          "description": "Monarch transformation of: {{ source.description }}",
          "url": "{{ source.ttlUrl }}",
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

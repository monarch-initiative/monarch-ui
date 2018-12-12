<template>
  <div
    id="genomeFeature"
    class="container-fluid">

    <svg
      id="genome-feature"
      width="80%"/>

    <div class="row">
      <div
        class="col-11">
        &nbsp;
      </div>
      <div
        id="jbrowse-link"
        class="col-1">
        <a
          :href="mygeneData.externalURL"
          target="_blank"
          rel="noopener noreferrer"
          class="fa fa-link"/>
      </div>
    </div>
  </div>
</template>

<script>
import GenomeFeatureViewer from 'GenomeFeatureViewer';

// Global View Example

const configGlobal = {
  'locale': 'global',
  'chromosome': 5,
  'start': 75574916,
  'end': 75656722,
  'tracks': [
    {
      id: 2,
      'genome': 'Mus musculus',
      'type': 'variant-global',
    },
    {
      'id': 1,
      'genome': 'Mus musculus',
      'type': 'isoform',
      'url': [
        'https://agr-apollo.berkeleybop.io/apollo/track/',
        '/All%20Genes/',
        '.json'
      ]
    },
  ]
};

export default {
  props: {
    mygeneData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    const viewer = new GenomeFeatureViewer(configGlobal, '#genome-feature', 700, 400);
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import "~GenomeFeatureViewerCSS";
</style>

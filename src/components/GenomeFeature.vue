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
    //
    // @nathandunn:
    // This is currently hardcoded to use the configGlobal example value
    // provided by the GFV demo.
    // It needs to use track data from MyGene.info, and that is currently
    // being fetched before this component is mounted, and is passed
    // in as a VueJS property.
    // This needs to be reconciled so that gene-specific data is fetched
    // from MyGene and then used to populate GFV, but there appears to
    // be no interface in GFV to do this.
    //
    // Uncomment the following to see the difference.
    // console.log('this.mygeneData.trackResponse');
    // console.log(JSON.stringify(this.mygeneData.trackResponse, null, 2));
    // console.log('configGlobal');
    // console.log(JSON.stringify(configGlobal, null, 2));
    //

    const viewer = new GenomeFeatureViewer(configGlobal, '#genome-feature', 700, 400);
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import "~GenomeFeatureViewerCSS";
</style>

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
      geneInfo: this.mygeneData.hits[0]
    };
  },
  mounted() {
    if (this.mygeneData.hits.length === 1) {
      this.generateView(this.mygeneData.hits[0]);
    }
  },
  methods: {
    availableGenomes(taxonId) {
      switch (taxonId) {
        case 6239:
          return 'Caenorhabditis elegans';
        case 7955:
          return 'Danio rerio';
        case 7227:
          return 'Drosophila melanogaster';
        case 9606:
          return 'Homo sapiens';
        case 10090:
          return 'Mus musculus';
        case 10116:
          return 'Rattus norvegicus';
        case 559292:
          return 'Saccharomyces cerevisiae';
        default:
          return null;
      }
    },
    generateView(genePosition) {
      // we can only draw certain taxons
      const genomeName = this.availableGenomes(genePosition.taxid);
      if (!genomeName) {
        return;
      }

      const position = genePosition.genomic_pos;
      let nameSuffixString = `?name=${genePosition.symbol}`;
      if (position.ensemblgene) {
        nameSuffixString += `&name=${position.ensemblgene}`;
      }

      const configGlobal = {
        'locale': 'global',
        'chromosome': position.chr,
        'start': position.start,
        'end': position.end,
        'tracks': [
          {
            'id': 1,
            'genome': genomeName,
            'type': 'isoform',
            'url': [
              'https://agr-apollo.berkeleybop.io/apollo/track/',
              '/All%20Genes/',
              `.json${nameSuffixString}`
            ]
          },
        ]
      };
      const viewer = new GenomeFeatureViewer(configGlobal, '#genome-feature', 700, 400);
    }

  }
};
</script>

<style lang="scss">
@import "~GenomeFeatureViewerCSS";
</style>

<template>
  <div>
    <div
      class="row"
      style="margin-left:20px">
      <a
        :href="mygeneData.externalURL"
        target="_blank"
        rel="noopener noreferrer"
        class="fa fa-link">
        Browse Genome at {{ position.chr }}:{{ position.start }}..{{ position.end }} {{ position.strand > 0 ?
        '+' : '-' }} ( {{ position.end-position.start }} kb)
      </a>
    </div>
    <div class="row">
      <svg
        id="genome-feature"
        width="80%"/>
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
    console.log(this.mygeneData);
    return {
      geneInfo: (this.mygeneData.hits && this.mygeneData.hits.length > 0) ? this.mygeneData.hits[0] : null,
      position: (this.mygeneData.hits && this.mygeneData.hits.length > 0) ? this.mygeneData.hits[0].genomic_pos : null,
    };
  },
  mounted() {
    if (this.mygeneData.hits && this.mygeneData.hits.length === 1) {
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
      if (!genomeName) return;
      const position = genePosition.genomic_pos;
      if (!position) return;

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
            ],
            'transcriptTypes': [
              'mRNA', 'ncRNA', 'piRNA',
              'lincRNA',
              'miRNA',
              'pre_miRNA',
              'snoRNA',
              'lnc_RNA',
              'tRNA',
              'snRNA',
              'rRNA',
              'ARS',
              'antisense_RNA',
              'C_gene_segment',
              'V_gene_segment',
              'pseudogene_attribute',
              'snoRNA_gene'
            ],
          },
        ]
      };
      const viewer = new GenomeFeatureViewer(configGlobal, '#genome-feature', 900, 500);
    }
  }
};
</script>

<style lang="scss">
    @import "~GenomeFeatureViewerCSS";
</style>

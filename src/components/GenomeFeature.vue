<template>
  <div
    class="genome-feature">
    <div
      v-if="mygeneData.externalURL"
      class="row">
      <svg
        id="genome-feature"
        width="80%"/>
    </div>

    <div
      v-if="mygeneData.externalURL"
      class="row p-3"
    >
      <a
        :href="mygeneData.externalURL"
        target="_blank"
        rel="noopener noreferrer"
        class="col-12">
        Browse Genome at {{ position.chr }}:{{ position.start }}..{{ position.end }} {{ position.strand > 0 ?
        '+' : '-' }} ( {{ position.end-position.start }} kb)
        <i class="fa fa-link"/>
      </a>
    </div>

    <div
      v-else>
      <h6>No Position Data Available for gene {{ geneInfo.symbol }}</h6>
    </div>
  </div>
</template>

<script>
import GenomeFeatureViewer from 'GenomeFeatureViewer';
import { idToLabel, isAGRApolloTaxon } from '../lib/TaxonMap';

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

    generateView(genePosition) {
      // we can only draw certain taxons
      const position = genePosition.genomic_pos;
      if (isAGRApolloTaxon(genePosition.taxid) && position) {
        const genomeName = idToLabel(`NCBITaxon:${genePosition.taxid}`);
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
  }
};
</script>

<style lang="scss">
@import "~GenomeFeatureViewerCSS";
@import "~@/style/variables";

.genome-feature {
  border-radius: 10px;
  border: solid darkgray 1px;
}

</style>

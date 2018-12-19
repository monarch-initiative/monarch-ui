<template>
 <div>
   <div
    v-if="pgVersion === index"
    ref="phenogridbox"
    :id="'phenogridbox-'+index"
  /></div>

</template>

<script>
export default {
  props: {
    xAxis: {
      type: Array,
      default: null
    },
    yAxis: {
      type: Array,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: null
    }

  },
  data() {
    return {
      pgVersion: null
    };
  },
  mounted() {
    this.pgVersion = this.index;
  },
  updated() {
    if (this.pgVersion === this.index) {
      this.launchPhenogrid();
    }
    else {
      this.pgVersion = this.index;
    }
  },
  methods: {




    launchPhenogrid() {
      const pgData = {
        'title': 'Phenogrid Results',
        'xAxis': this.xAxis,
        'yAxis': this.yAxis
      };
      Phenogrid.createPhenogridForElement(this.$refs.phenogridbox, {
        serverURL: 'https://monarchinitiative.org',
        gridSkeletonData: pgData,
        selectedCalculation: 0,
        selectedSort: 'Frequency',
        geneList: this.xAxis,
        owlSimFunction: this.mode
      });
    }
  }
};
</script>

<template>
  <div
    v-if="pgVersion === index"
    :id="'phenogridbox-' + index"
    ref="phenogridbox"
  />
</template>

<script>
import { biolink } from "@/api/bio-link";

const Phenogrid = require("phenogrid");

export default {
  props: {
    xAxis: {
      type: Array,
      default: null,
    },
    yAxis: {
      type: Array,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      pgVersion: null,
    };
  },
  mounted() {
    this.pgVersion = this.index;
  },
  updated() {
    if (this.pgVersion === this.index) {
      this.launchPhenogrid();
    } else {
      this.pgVersion = this.index;
    }
  },
  methods: {
    launchPhenogrid() {
      const pgData = {
        title: "Phenogrid Results",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
      };

      const appBase = window.location.protocol + "//" + window.location.host;

      Phenogrid.createPhenogridForElement(this.$refs.phenogridbox, {
        serverURL: biolink,
        forceBiolink: true,
        appURL: appBase,
        gridSkeletonData: pgData,
        selectedCalculation: 0,
        selectedSort: "Frequency",
        geneList: this.xAxis,
        owlSimFunction: this.mode,
      });
    },
  },
};
</script>

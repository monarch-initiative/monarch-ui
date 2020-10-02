<template>
  <div class="histo-pheno" />
</template>

<script>
import ApexCharts from 'apexcharts';

export default {
  props: {
    activeItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      histoPheno: null
    };
  },
  watch: {
    activeItem: {
      handler: 'updateHistoPheno'
    }
  },
  mounted() {
    this.updateHistoPheno();
  },
  methods: {
    generateHistoPheno(options) {
      // Generates initial Chart
      this.histoPheno = new ApexCharts(document.querySelector('.histo-pheno'), options);
      this.histoPheno.render();
    },
    refreshHistoPheno(options) {
      // Updates data on the chart
      this.histoPheno.updateOptions(options);
    },
    getChartOptions(dataSeries, labels) {
      return {
        series: [{
          data: dataSeries
        }],
        colors: ['#CCE34C'],
        chart: {
          type: 'bar',
          redrawOnParentResize: true,
          height: '100%',
          width: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 0,
          colors: ['#fff']
        },
        xaxis: {
          showForNullSeries: false,
          categories: labels,
          labels: {
            style: {
              colors: ['#fff']
            }
          },
          title: {
            text: '# of Phenotypes',
            style: {
              color: '#FFF'
            }
          },
          lines: {
            show: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          showForNullSeries: false,
          title: {
            text: undefined
          },
          labels: {
            style: {
              colors: ['#fff']
            }
          }
        },
        tooltip: {
          enabled: false
        },
        fill: {
          opacity: 1
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        }
      };
    },
    updateHistoPheno() {
      let activeItem = this.activeItem.categories;
      // Remove categories with 0, sort desc
      Object.keys(activeItem).forEach(key => (activeItem[key] === 0) && delete activeItem[key]);
      activeItem = Object.entries(activeItem);
      activeItem = activeItem.sort((a, b) => b[1] - a[1]);
      activeItem = Object.fromEntries(activeItem);
      const labels = Object.keys(activeItem);
      const dataSeries = Object.values(activeItem);
      const options = this.getChartOptions(dataSeries, labels);
      if (this.histoPheno) {
        this.refreshHistoPheno(options);
      } else {
        this.generateHistoPheno(options);
      }
    }
  }
};
</script>

<style>
.apexcharts-yaxis-label, .apexcharts-xaxis-title-text {
    color: white;
    fill: white;
}
</style>

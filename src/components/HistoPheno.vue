<template>
  <div class="histo-pheno">
  </div>
</template>

<script>
import ApexCharts from 'apexcharts';

export default {
    props: {
        activeItem: {
            type: Object,
            required: true
        },
        colorScheme: {
            type: String,
            default: "light"
        }
    },
    watch: {
        activeItem: {
            handler: 'updateHistoPheno'
        }
    },
    data(){
        return {
            histoPheno: null
        }
    },
    mounted(){
        this.updateHistoPheno();
    },
    methods: {
        generateHistoPheno(options) {
            // Generates initial Chart
            this.histoPheno = new ApexCharts(document.querySelector(".histo-pheno"), options);
            this.histoPheno.render();
        },
        refreshHistoPheno(options){
            // Updates data on the chart
            this.histoPheno.updateOptions(options);
        },
        getChartOptions(dataSeries, labels) {
            let color = "#FFF";
            let customClass = "light";
            if(this.colorScheme == 'dark'){
                color = "#868686";
                customClass = "dark";
            }
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
                    colors: [color]
                },
                xaxis: {
                    showForNullSeries: false,
                    categories: labels,
                    labels: {
                        style: {
                            colors: [color],
                            cssClass: customClass
                        }
                    },
                    title: {
                        text: "# of Phenotypes",
                        style: {
                            color: color,
                            cssClass: customClass
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
                                colors: [color],
                                cssClass: customClass
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
        updateHistoPheno(){
            let activeItem = this.activeItem.categories;
            // Remove categories with 0, sort desc
            Object.keys(activeItem).forEach((key) => (activeItem[key] == 0) && delete activeItem[key]);
            activeItem = Object.entries(activeItem);
            activeItem = activeItem.sort((a,b) => b[1] - a[1]);
            activeItem = Object.fromEntries(activeItem);
            const labels = Object.keys(activeItem);
            const dataSeries = Object.values(activeItem);
            const options = this.getChartOptions(dataSeries, labels);
            if(this.histoPheno){
                this.refreshHistoPheno(options);
            } else {
                this.generateHistoPheno(options);
            }
        }
    }
};
</script>

<style>
.apexcharts-yaxis-label.light, .apexcharts-xaxis-title-text {
    color: white;
    fill: white;
}
.apexcharts-yaxis-label.dark, .apexcharts-xaxis-title-text.dark {
    color: grey;
    fill: grey;
}
</style>
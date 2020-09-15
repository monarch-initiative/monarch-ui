<template>
    <div>
        <div v-if="activeCarousel" class="disease-carousel">
            <h3 class="carousel-title">Featured Diseases - August 2020</h3>
            <p class="carousel-sub">We are always updating our corpus of disease - phenotype associations to support current scientific understanding of disease.
            <div class="row carousel-row" v-if="activeCarousel.id">
                <div class="col-6 disease-information">
                    <h3 class="disease-name">
                        <a :href="'/disease/' + activeCarousel.id">
                        {{activeCarousel.label}}
                        </a>
                        <span class="disease-id">
                            {{activeCarousel.id}}
                        </span>
                    </h3>
                    <p class="disease-description">{{activeCarousel.description}}</p>
                    <b-button class="linked-data-btn" :to="'/disease/' + activeCarousel.id">
                    View Linked Data
                    <i class="fa fa-caret-right"></i>
                    </b-button>
                </div>
                <div class="col-6 disease-phenotypes">
                    <histo-pheno :active-item="activeCarousel"></histo-pheno>
                </div>
            </div>
            <div class="disease-loading" v-else>
                <b-spinner label="Loading..." variant="light"></b-spinner>
            </div>
        </div>
    </div>
</template>
<script>
import HistoPheno from '@/components/HistoPheno.vue';
import { getRecentlyCurated } from '@/api/Resources';
import { getPhenotypeCategories, getBasicNode } from '@/api/BioLink';
export default {
    data() {
        return {
            carouselData: [],
            activeCarousel: {}
        }
    },
    async mounted() {
        const recentlyCurated = await getRecentlyCurated();
        for(let curated of recentlyCurated){
            const categories = await getPhenotypeCategories(curated.mondo);
            const basicInfo = await getBasicNode(curated.mondo);
            if(!Object.values(categories).every((x) => x == 0)){
                this.carouselData.push({
                    categories: categories,
                    label: basicInfo.label,
                    id: curated.mondo,
                    description: basicInfo.description,
                    date: curated.date
                });
            }
        }
        this.activeCarousel = this.carouselData[0];
        setInterval(this.changeActiveCarouselItem, 30000);
    },
    methods: {
        changeActiveCarouselItem(){
            const pos = this.carouselData.map((x) => x.id).indexOf(this.activeCarousel.id);
            const limit = this.carouselData.length - 1;
            const next = pos + 1;
            if(pos == limit){
                this.activeCarousel = this.carouselData[0];
            } else {
                this.activeCarousel = this.carouselData[next];
            }
        },
        isEmpty(){
            return Object.keys(this.activeCarousel).length === 0;
        }
    },
    components: {
      'histo-pheno': HistoPheno
    }
};
</script>

<style scoped>

    .disease-carousel {
        height: 425px;
    }

    .disease-carousel .carousel-title {
        margin: 0;
        padding: 1rem 0 .5rem 0;
        text-align: center;
        color: white;
        text-transform: uppercase;
    }

    .disease-carousel .carousel-sub {
        color: white;
        text-align: center;
        margin-bottom: .5rem;
        font-style: italic;
    }

    .disease-carousel .carousel-row {
        height: 80%;
    }

    .disease-carousel .disease-information {
        padding: .5rem 1rem 2.5rem 5.5rem;
        color: white;
    }

    .disease-carousel .disease-information .disease-name {
        text-transform: capitalize;
    }

    .disease-carousel .disease-information .disease-name a {
        color: white !important;
    }

    .disease-carousel .disease-information .disease-name .disease-id {
        font-size: 1rem;
        color: lightgray
    }
    
    .disease-carousel .disease-information .disease-description {
        margin-top: 1.5rem;
    }

    .disease-carousel .linked-data-btn {
        color: black;
        background: #CCE34C;
        border-radius: 0;
    }

    .disease-carousel .linked-data-btn .fa-caret-right {
        margin-left: 15px;
    }

    .disease-loading {
        text-align: center;
        margin-top: 2.5rem;
    }
</style>
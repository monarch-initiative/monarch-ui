<template>
  <div>
    <div v-if="activeCarousel" class="disease-carousel">
      <h3 class="carousel-title">
        Featured Diseases
      </h3>
      <p class="carousel-sub">
        We are always updating our corpus of disease - phenotype associations to support current scientific understanding of disease.
      </p><div v-if="activeCarousel.id" class="row carousel-row">
        <div class="col-6 disease-information">
          <h3 class="disease-name">
            <a :href="'/disease/' + activeCarousel.id">
              {{ activeCarousel.label }}
            </a>
            <span class="disease-id">
              {{ activeCarousel.id }}
            </span>
          </h3>
          <p class="disease-description">
            {{ activeCarousel.description }}
          </p>
          <b-button class="linked-data-btn" :to="'/disease/' + activeCarousel.id">
            View Linked Data
            <i class="fa fa-caret-right" />
          </b-button>
        </div>
        <div class="col-6 disease-phenotypes">
          <histo-pheno :active-item="activeCarousel" />
        </div>
      </div>
      <div v-else class="disease-loading">
        <b-spinner label="Loading..." variant="light" />
      </div>
    </div>
  </div>
</template>
<script>
import HistoPheno from '@/components/HistoPheno.vue';
import { getRecentlyCurated } from '@/api/Resources';
import { getPhenotypeCategories, getBasicNode } from '@/api/BioLink';

export default {
  components: {
    'histo-pheno': HistoPheno
  },
  data() {
    return {
      carouselData: [],
      activeCarousel: {},
      featureDate: ''
    };
  },
  async mounted() {
    const recentlyCurated = await getRecentlyCurated();
    await Promise.all(recentlyCurated.map(async (curated) => {
      const categories = await getPhenotypeCategories(curated.mondo);
      const basicInfo = await getBasicNode(curated.mondo);
      if (!Object.values(categories).every(x => x === 0)) {
        this.carouselData.push({
          categories,
          label: basicInfo.label,
          id: curated.mondo,
          description: basicInfo.description,
          date: curated.date
        });
      }
    }));
    if (this.carouselData.length > 0) {
      this.setDate(this.carouselData[0].date);
      this.changeActiveCarouselItem();
      setInterval(this.changeActiveCarouselItem, 6000);
    }
  },
  methods: {
    changeActiveCarouselItem() {
      const pos = this.carouselData.map(x => x.id).indexOf(this.activeCarousel.id);
      const limit = this.carouselData.length - 1;
      const next = pos + 1;
      if (pos === limit || pos === -1) {
        this.activeCarousel = this.carouselData[0];
      } else {
        this.activeCarousel = this.carouselData[next];
      }
    },
    isEmpty() {
      return Object.keys(this.activeCarousel).length === 0;
    },
    setDate(date) {
      date = new Date(date);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      this.featureDate = '- ' + month + ' ' + year;
    }
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

    .disease-phenotypes {
        height: 100%;
    }

    .disease-loading {
        text-align: center;
        margin-top: 2.5rem;
    }
</style>

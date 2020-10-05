<template>
  <div class="container-fluid monarch-home-view">
    <vml-home-intro-component />
    <vml-home-about-monarch-component />
    <vml-home-news-component />
    <disease-carousel />
    <vml-home-partners-component />
  </div>
</template>


<style lang="scss">
  @import "~@/style/variables";

  div.container-fluid.monarch-home-view {
    padding: 0;
    background: $monarch-bg-color;

    .row {
      margin-left: 0;
      margin-right: 0;
    }
    .row > div {
      width: 100%;
    }

    .spacer {
      height: 50px;
    }
  }
</style>


<script>
import DiseaseCarousel from '@/components/DiseaseCarousel.vue';

export default {
  name: 'Home',
  components: {
    'vml-home-intro-component': require('@/components/home/HomeIntro.md').default,
    'vml-home-about-monarch-component': require('@/components/home/HomeAboutMonarch.md').default,
    'vml-home-news-component': require('@/components/home/HomeNews.md').default,
    'vml-home-partners-component': require('@/components/home/HomePartners.md').default,
    'disease-carousel': DiseaseCarousel
  },
};
</script>

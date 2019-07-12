<template>
  <div
    class="container-fluid monarch-home-view">

    <div class="row">
      <vml-home-intro-component/>
    </div>
    <vml-home-what-we-do-component/>
    <vml-home-data-component/>
    <vml-home-news-component/>
    <vml-home-partners-component/>

  </div>
</template>


<style lang="scss">
  @import "~@/style/variables";

  div.container-fluid.monarch-home-view {
    padding: 0;
    background: $monarch-bg-color;
    .row > div {
      width: 100%;
    }

    // //
    // // Horizontal borders for debugging home page layout
    // //
    // > div:not(.row),
    // > .row > div {
    //   border-top:2px solid orange;
    //   border-bottom:2px solid orange;
    // }
  }
</style>


<script>
export default {
  name: 'Home',
  components: {
    'vml-home-intro-component': require('@/components/HomeIntro.md').default,
    'vml-home-about-monarch-component': require('@/components/HomeAboutMonarch.md').default,
    'vml-home-what-we-do-component': require('@/components/HomeWhatWeDo.md').default,
    'vml-home-news-component': require('@/components/HomeNews.md').default,
    'vml-home-data-component': require('@/components/HomeData.md').default,
    'vml-home-partners-component': require('@/components/HomePartners.md').default,
  },
};
</script>

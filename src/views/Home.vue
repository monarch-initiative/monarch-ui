<template>
  <div
    id="monarch-home-container"
    class="container-fluid monarch-container monarch-home-container">

    <div class="row">
      <vml-home-intro-component/>
    </div>
    <vml-home-about-monarch-component/>
    <vml-home-what-we-do-component/>
    <vml-home-news-component/>
    <vml-home-data-component/>
    <vml-home-partners-component/>

    <div class="row">
      <home-footer/>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    'vml-home-intro-component': require('@/components/HomeIntro.vmlmd').default,
    'vml-home-about-monarch-component': require('@/components/HomeAboutMonarch.vmlmd').default,
    'vml-home-what-we-do-component': require('@/components/HomeWhatWeDo.vmlmd').default,
    'vml-home-news-component': require('@/components/HomeNews.vmlmd').default,
    'vml-home-data-component': require('@/components/HomeData.vmlmd').default,
    'vml-home-partners-component': require('@/components/HomePartners.vmlmd').default,

    'home-footer': require('@/components/HomeFooter.vue').default,
  },
};
</script>

<style lang="scss">
  @import "~@/style/variables";

  .monarch-home-container {
    padding-top: $navbar-height;
  }

  #monarch-home-container > div:not(.row) {
    xborder-top:1px solid orange; // For debugging home page layout
    xborder-bottom:1px solid orange; // For debugging home page layout
  }
  #monarch-home-container > .row > div {
    xborder-top:1px solid cyan; // For debugging home page layout
    xborder-bottom:1px solid cyan; // For debugging home page layout
    width: 100%;
  }


  //
  // Default classes for subelements of Home
  // Potentially overridden by the various subelements
  //
  .monarch-home-container p {
    font-size: 18px;

    @media(min-width:$grid-float-breakpoint) {
      font-size: 20px;
    }
  }
</style>

<div
  class="intro">

![](../assets/img/monarch-logo-white-stacked.png)

#### Advancing *translational science* by **semantically integrating** biological information across species.

  <embedded-autocomplete
    :home-search="true"
    :show-search-button="true"
    :auto-focus="true"
  />

</div>


<script>
import MonarchAutocomplete from '@/components/MonarchAutocomplete.vue';

export default {
  name: 'Home',
  components: {
    'embedded-autocomplete': MonarchAutocomplete,
  },
};
</script>


<style lang="scss">
@import "~@/style/variables";

div.intro {
  margin: auto;
  padding: 20px;
  text-align: center;
  color: white;
  background-color: $monarch-bg-color;

  vertical-align: middle;

  img {
    max-height:80px;
  }

  h4 {
    font-size: 20px;
  }

  @media(min-width:$grid-float-breakpoint) {
    h4 {
      font-size: 24px;
    }
  }
}
</style>

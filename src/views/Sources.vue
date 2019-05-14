<template>
  <div>
    <br><br>
    <h1>Monarch Sources</h1>
    <br>
    <h2>Monarch Sources</h2>
    <div class="container">
      <div class="row border">
        <div class="col-1">  id </div>
        <div class="col-6">  title </div>
        <div class="col-2">  sourceDate </div>
        <div class="col-3">  url </div>
      </div>
      <div
        v-for="(source, index) in sources"
        :key="index"
        class="row">
        <div class="col-1"> {{ source.id }}</div>
        <div class="col-6"> {{ source.title }}</div>
        <div class="col-2"> {{ source.sourceDate }}</div>
        <div class="col-3"> <a
          :href="source.url"
          target="_blank">{{ source.url }}</a></div>
      </div>
    </div>
    <monarch-footer/>
  </div>
</template>

<script>
import getSources from '@/api/Sources';

export default {
  name: 'Sources',
  components: {
    'monarch-footer': require('@/components/Footer.md').default,
  },
  data() {
    return {
      sources: [],
    };
  },
  async mounted() {
    this.sources = (await getSources()).sources;
    console.log('Num sources=', this.sources);
  },
  // mounted() {
  // }
};
</script>

<style>

</style>

<template>
  <div class="container-fluid route-error-view">
    <br />
    <br />
    <br />
    <br />
    <h3 class="text-center border">
      No such path available: <b>{{ badPath }}</b>
    </h3>
  </div>
</template>

<script>
export default {
  name: "RouteError",
  data() {
    return {
      badPath: null,
    };
  },
  mounted() {
    this.badPath = this.$route.path;
  },
  methods: {},
};
</script>

<style>
.container-fluid.route-error-view {
}
</style>

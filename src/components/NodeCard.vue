<template>
  <!-- eslint-disable vue/html-indent -->

  <div
    :class="{ active: isSelected }"
    class="card node-card"
    @click="toggleSelected()">
    <div class="card-title card-header">
      <img
        :src="cardIcon"
        class="card-img-top">
      {{ pluralize(cardLabel, cardCount) }}
    </div>
  </div>

</template>

<script>

export default {
  name: 'NodeCard',

  /* eslint vue/require-default-prop: 0 */
  /* eslint vue/require-prop-types: 0 */
  props: [
    'cardType',
    'cardCount',
    'parentNode',
    'parentNodeId'
  ],

  data() {
    return {
      isSelected: false,
      cardIcon: null,
      cardLabel: null
    };
  },

  created() {
  },

  updated() {
  },

  destroyed() {
  },

  mounted() {
    this.cardIcon = this.$parent.icons[this.cardType];
    this.cardLabel = this.$parent.labels[this.cardType];
  },

  methods: {
    toggleSelected() {
      this.isSelected = !this.isSelected;
      if (this.isSelected) {
        this.$emit('expand-card', this);
      }
    },

    pluralize(label, count) {
      const s = count === 1 ? '' : 's';
      return `${count} ${label}${s}`;
    }
  }

};

</script>

<style lang="scss">
@import "~@/style/variables";

$card-height: 75px;
$card-width: 400px;

.card.node-card {
  margin: 0 auto;
  padding: 0;
  min-height: $card-height;
  max-height: $card-height;
  min-width: 90%;
  max-width: 90%;
  cursor: pointer;
  border:none;
}

.card.node-card .card-img-top {
  width:40px;
  height:40px;
  margin-right: 10px;
}

.card-title.card-header {
  font-weight: 600;
  padding-left: 10px;
}

$sm-width: map-get($grid-breakpoints, "sm");
@media (min-width: $sm-width) {
  .card.node-card {
    min-width: 40%;
    max-width: 40%;
    margin-bottom: 5px;
  }
}

$md-width: map-get($grid-breakpoints, "md");
@media (min-width: $md-width) {
  .card.node-card {
    min-width: $card-width;
    max-width: $card-width;
    xborder:5px solid red;
  }
}

</style>

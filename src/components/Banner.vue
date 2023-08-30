<template>
  <aside v-if="open" class="banner">
    <div>
      <slot />
    </div>
    <button class="banner-button" @click="open = false">Close</button>
  </aside>
</template>

<script>
export default {
  data() {
    return { open: true };
  },
};
</script>

<style lang="scss">
.banner {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  background: hsl(185, 75%, 80%);
  text-align: center;
}

.banner-button {
  background: #00000020;
  border: none;
}
</style>

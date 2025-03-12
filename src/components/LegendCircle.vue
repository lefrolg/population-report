<script setup>
defineProps({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: false,
    default: 14,
  }
})
</script>

<template>
  <span v-if="color" class="legend" :style="{backgroundColor: color, width: size + 'px'}"></span>

</template>

<style scoped lang="scss">
.legend {
  aspect-ratio: 1;
  border-radius: 100%;
}
</style>

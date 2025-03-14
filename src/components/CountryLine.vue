<script setup>
import CountrySelect from "@/components/CountrySelect.vue";
import CityMultiselect from "@/components/CityMultiselect.vue";

const props = defineProps({
  countryId: {
    type: Number,
    required: true,
  }
})
const emits = defineEmits(['removeCountry'])


function removeLine() {
  emits('removeCountry', props.countryId);
}

</script>

<template>
  <div class="country py-2 border-b d-flex ga-3">
    <div class="w-100">
      <country-select
        :country-id="countryId"
      />
      <city-multiselect
        :country-id="countryId"
      />
    </div>
    <v-btn
      icon="mdi-close"
      variant="plain"
      density="comfortable"
      title="Remove line"
      @click="removeLine"
    />
  </div>
</template>

<style scoped lang="scss">
</style>

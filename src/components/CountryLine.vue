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

const selectedCountry = defineModel();
const selectedCities = ref([]);

const selectedCountryIso = computed(() => selectedCountry.value?.iso2)
</script>

<template>
  <div class="country py-2 border-b d-flex ga-3">
    <div class="w-100">
      <country-select v-model:selected-country="selectedCountry" />
      <city-multiselect
        v-if="selectedCountry"
        v-model:selected-cities="selectedCities"
        :selected-country-iso="selectedCountryIso"
      />
    </div>
    <v-btn icon="mdi-close" variant="plain" density="comfortable" title="Remove line" @click="removeLine"></v-btn>
  </div>
</template>

<style scoped lang="scss">
</style>

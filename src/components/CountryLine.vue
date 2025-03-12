<script setup>
import CountrySelect from "@/components/CountrySelect.vue";
import CityMultiselect from "@/components/CityMultiselect.vue";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  countryId: {
    type: Number,
    required: true,
  }
})
const emits = defineEmits(['removeCountry'])

const store = useSelectedCountriesStore();
const {selectedCountriesIso} = storeToRefs(store)

function removeLine() {
  emits('removeCountry', props.countryId);
}

const selectedCountry = computed({
  set: (value) => {
    store.updateCountry(props.countryId, value, [])
  },
  get: () => {
    const {name, iso2} = store.getCountryById(props.countryId);
    return name ? {name, iso2} : null;
  }
});
const selectedCities = computed({
  set: (value) => {
    store.updateCities(props.countryId, value)
  },
  get: () => {
    return store.getCountryCities(props.countryId)
  }
});

const selectedCountryIso = computed(() => selectedCountry.value?.iso2)


</script>

<template>
  <div class="country py-2 border-b d-flex ga-3">
    <div class="w-100">
      <country-select
          v-model:selected-country="selectedCountry"
          :excluded="selectedCountriesIso"
      />
      <city-multiselect
          v-if="selectedCountryIso"
          v-model:selected-cities="selectedCities"
          :selected-country-iso="selectedCountryIso"
      />
    </div>
    <v-btn icon="mdi-close" variant="plain" density="comfortable" title="Remove line" @click="removeLine"></v-btn>
  </div>
</template>

<style scoped lang="scss">
</style>

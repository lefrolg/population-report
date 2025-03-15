<script setup>
import CountrySelect from "@/components/CountrySelect.vue";
import CityMultiselect from "@/components/CityMultiselect.vue";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  countryId: {
    type: String,
    required: true,
  }
})
const emits = defineEmits(['removeCountry'])
const store = useSelectedCountriesStore();
const {createdLines} = storeToRefs(store)

const countryIso = computed(() => createdLines.value[props.countryId] || null)

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
        v-if="countryIso"
        :country-iso="countryIso"
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

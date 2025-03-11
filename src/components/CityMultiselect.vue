<script setup>
import {fetchCity} from "@/services/cities.js";
import debounce from "@/utils/debounce.js";

const props = defineProps(['selectedCountryIso', 'selectedCities'])
defineEmits(["update:selectedCities"]);

const searchCity = ref('')
const isLoadingCities = ref(false);
const cities = ref([]);

async function setCities() {
  isLoadingCities.value = true;

  cities.value = [];
  const data = await fetchCity(props.selectedCountryIso, encodeURI(searchCity.value))
  cities.value = data ? data.map(city => ({value: city, title: city.name})) : []

  isLoadingCities.value = false;
}

watch(searchCity, debounce(() => setCities()));
onMounted(() => setCities())
watch(() => props.selectedCountryIso, setCities);

</script>

<template>
  <v-select
    :class="{'mt-2': !selectedCities.length, 'mt-3': selectedCities.length}"
    label="Select cities"
    variant="outlined"
    density="compact"
    multiple
    chips
    hide-details="auto"
    :value="selectedCities"
    @update:modelValue="$emit('update:selectedCities', $event)"
    :items="cities"
    :loading="isLoadingCities"
    :no-data-text="isLoadingCities ? 'Loading...': 'No cities found'"
    closable-chips
    :return-object="true"
  >
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field
          @keydown.space.stop
          v-model="searchCity" placeholder="Type to search" variant="plain" density="compact"
          hide-details="auto"/>
      </v-list-item>
    </template>
    <template #append-item>
      <small class=" d-block text-center">Only 1 search result available, search for more</small>
    </template>
  </v-select>

</template>

<style scoped lang="scss">

</style>

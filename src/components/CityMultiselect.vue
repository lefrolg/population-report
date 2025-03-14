<script setup>
import {fetchCity} from "@/services/cities.js";
import debounce from "@/utils/debounce.js";
import LegendCircle from "@/components/LegendCircle.vue";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

const props = defineProps(['countryId'])

const store = useSelectedCountriesStore();
const {maxCities} = storeToRefs(store)

const selectedCitiesValue = computed({
  set: (values) => {
    if (values.length > maxCities.value) return;
    const citiesValue = citiesWithRecent.value.filter((city) => values.includes(city.name))
    store.updateCities(props.countryId, citiesValue)
  },
  get: () => {
    return store.getCountryCities(props.countryId) || []
  }
})

const searchCity = ref(null)
const isLoadingCities = ref(false);
const cities = ref([]);
const recentCities = ref([]);

function resetState() {
  searchCity.value = null;
  isLoadingCities.value = false;
  cities.value = [];
  recentCities.value = [];
}

const selectedCountryIso = computed(() => {
  return store.getCountryById(props.countryId)?.iso2 || ''
})

watch(selectedCountryIso, () => {
  resetState();
  setCities();
});

watch(searchCity,
  debounce(() => {
    updateRecentCities();
    setCities()
  })
);

async function setCities() {
  if (!selectedCountryIso.value) return;
  isLoadingCities.value = true;

  cities.value = [];
  const data = await fetchCity(selectedCountryIso.value, encodeURI(searchCity.value || ''))
  cities.value = data ? data : []

  isLoadingCities.value = false;
}

function updateRecentCities() {
  recentCities.value.push(...cities.value
    .filter(city => !recentCities.value.find(c => c.name === city.name))
    .map(city => ({
        ...city,
        isRecent: true
      })
    ));
}


const citiesWithRecent = computed(() => {
  const recentCitiesWithoutSearchResult = recentCities.value.filter(city => !cities.value.find(c => c.name === city.name));
  return cities.value.concat(recentCitiesWithoutSearchResult)
})

const isLimitReached = computed(() => selectedCitiesValue.value.length >= maxCities.value);

const itemProps = (city) => ({
  value: city.name,
  title: city.name,
  subtitle: city.isRecent ? "Recent" : searchCity.value ? "Search result" : '',
})

function getCityColor(name) {
  return selectedCitiesValue.value.find(city => city.name === name)?.color || ''
}

</script>

<template>
  <v-select
    v-if="selectedCountryIso"
    :class="{'mt-2': !selectedCitiesValue.length, 'mt-3': selectedCitiesValue.length}"
    label="Select cities"
    variant="outlined"
    density="compact"
    multiple
    chips
    hide-details="auto"
    v-model="selectedCitiesValue"
    :items="citiesWithRecent"
    :item-props="itemProps"
    :loading="isLoadingCities"
    no-data-text="No cities found"
    closable-chips
    :auto-select-first="false"
  >
    <template #chip="{item, props}" v-bind="props">
      <v-chip v-bind="props">
        <legend-circle class="mr-2" :color="getCityColor(item.title)" :size="16"/>
        {{ item.title }}
      </v-chip>
    </template>
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field
          clearable
          @keydown.stop
          v-model="searchCity" placeholder="Type to search" variant="plain" density="compact"
          hide-details="auto"/>
      </v-list-item>
      <v-list-item v-if="isLimitReached" class="text-red-darken-3">
        Limit of cities reached
      </v-list-item>
      <v-list-item v-if="isLoadingCities">
        Loading...
      </v-list-item>
      <v-list-item v-else-if="searchCity && !cities.length">
        No cities found
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped lang="scss">

</style>

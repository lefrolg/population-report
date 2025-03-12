<script setup>
import {fetchCity} from "@/services/cities.js";
import debounce from "@/utils/debounce.js";

const props = defineProps(['selectedCountryIso', 'selectedCities'])
const emits = defineEmits(["update:selectedCities"]);

const selectedCitiesValue = computed({
  set: (values) => {
    const citiesValue = citiesWithRecent.value.filter((city) => values.includes(city.name))
    emits("update:selectedCities", citiesValue);
  },
  get: () => {
    if (props.selectedCities) {
      return props.selectedCities.map((city) => city.name);
    } else {
      return [];
    }
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

async function setCities() {
  isLoadingCities.value = true;

  cities.value = [];
  const data = await fetchCity(props.selectedCountryIso, encodeURI(searchCity.value || ''))
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

watch(searchCity,
    debounce(() => {
      updateRecentCities();
      setCities()
    })
);
onMounted(() => setCities())
watch(() => props.selectedCountryIso, () => {
  resetState();
  setCities();
});

const citiesWithRecent = computed(() => {
  const recentCitiesWithoutSearchResult = recentCities.value.filter(city => !cities.value.find(c => c.name === city.name));
  return cities.value.concat(recentCitiesWithoutSearchResult)
})

const itemProps = (city) => ({
  value: city.name,
  title: city.name,
  subtitle: city.isRecent ? "Recent" : searchCity.value ? "Search result" : '',
})

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
      v-model="selectedCitiesValue"
      :items="citiesWithRecent"
      :item-props="itemProps"
      :loading="isLoadingCities"
      no-data-text="No cities found"
      closable-chips
  >
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field
            clearable
            @keydown.space.stop
            v-model="searchCity" placeholder="Type to search" variant="plain" density="compact"
            hide-details="auto"/>
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

<script setup>
import {fetchCountry} from "@/services/countries.js";
import debounce from "@/utils/debounce.js";
import colors from 'vuetify/lib/util/colors';
import LegendCircle from "@/components/LegendCircle.vue";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

const props = defineProps([ 'countryId'])
const store = useSelectedCountriesStore();
const {selectedCountriesIso: excluded} = storeToRefs(store)

const searchCountry = ref(null)
const isLoadingCountries = ref(false);
const countries = ref([])
const fetchLimit = ref(30);

const selectedCountry = computed({
  set: (value) => {
    store.updateCountry(props.countryId, value)
  },
  get: () => {
    const {name, iso2} = store.getCountryById(props.countryId);
    return name ? {name, iso2} : null;
  }
});

const countryColor = computed(() => colors[store.getCountryById(props.countryId)?.baseColor]?.base || '')

onMounted(() => setCountries())

watch(searchCountry, debounce(() => setCountries()))
async function setCountries() {
  isLoadingCountries.value = true;
  countries.value = [];
  const data = await fetchCountry(encodeURI(searchCountry.value || ''), fetchLimit.value)

  countries.value = data ? data : []

  isLoadingCountries.value = false;
}

const itemProps = (country) => ({
  value: country,
  title: country.name,
  subtitle: excluded.value.includes(country.iso2) ? 'Country already selected' : '',
  disabled: excluded.value.includes(country.iso2)
})

</script>

<template>
  <v-select
    :class="{'mt-1': selectedCountry}"
    label="Select country"
    variant="outlined"
    density="compact"
    hide-details="auto"
    v-model="selectedCountry"
    :items="countries"
    :item-props="itemProps"
    :loading="isLoadingCountries"
    :no-data-text="isLoadingCountries ? 'Loading...':'No countries found'"
    :auto-select-first="false"
  >
    <template #selection v-if="selectedCountry">
      <legend-circle class="mr-2" :color="countryColor" :size="16" />
      {{ selectedCountry.name }}
    </template>
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field v-model="searchCountry" placeholder="Type to search" variant="plain"
                      density="compact" @keydown.stop clearable
                      hide-details="auto"/>
      </v-list-item>
    </template>
    <template #item="{props, item}">
      <v-list-item
        v-bind="!item.disabled ? props : {}"
        :class="{disabled: item.disabled}"
      ></v-list-item>
    </template>
    <template #append-item v-if="!searchCountry && countries.length >= fetchLimit">
      <small class=" d-block text-center">Search to see more</small>
    </template>
  </v-select>
</template>

<style scoped lang="scss">
</style>

<script setup>
import {fetchCountry} from "@/services/countries.js";
import debounce from "@/utils/debounce.js";
import colors from 'vuetify/lib/util/colors';
import LegendCircle from "@/components/LegendCircle.vue";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  countryId: {
    type: String,
    required: true,
  }
})
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
    const country = store.getCountryById(props.countryId)
    if (!country) {
      return null
    }
    const {name, iso2, color} = country;
    return {name, iso2, color};
  }
});

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
    v-model="selectedCountry"
    :class="{'mt-1': selectedCountry}"
    label="Select country"
    variant="outlined"
    density="compact"
    hide-details="auto"
    :items="countries"
    :item-props="itemProps"
    :loading="isLoadingCountries"
    :no-data-text="isLoadingCountries ? 'Loading...':'No countries found'"
    :auto-select-first="false"
  >
    <template
      v-if="selectedCountry"
      #selection
    >
      <legend-circle
        class="mr-2"
        :color="selectedCountry?.color"
        :size="16"
      />
      {{ selectedCountry.name }}
    </template>
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field
          v-model="searchCountry"
          placeholder="Type to search"
          variant="plain"
          density="compact"
          clearable
          hide-details="auto"
          @keydown.stop
        />
      </v-list-item>
    </template>
    <template #item="{props, item}">
      <v-list-item
        v-bind="!item.disabled ? props : {}"
        :class="{disabled: item.disabled}"
      />
    </template>
    <template
      v-if="!searchCountry && countries.length >= fetchLimit"
      #append-item
    >
      <small class=" d-block text-center">Search to see more</small>
    </template>
  </v-select>
</template>

<style scoped lang="scss">
</style>

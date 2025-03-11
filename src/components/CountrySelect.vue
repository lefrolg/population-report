<script setup>
import {fetchCountry} from "@/services/countries.js";
import debounce from "@/utils/debounce.js";

defineProps(['selectedCountry'])
defineEmits(["update:selectedCountry"]);

const searchCountry = ref('')
const isLoadingCountries = ref(false);
const countries = ref([])
const fetchLimit = ref(30);

onMounted(() => setCountries())

async function setCountries() {
  isLoadingCountries.value = true;
  countries.value = [];
  const data = await fetchCountry(encodeURI(searchCountry.value), fetchLimit.value)

  countries.value = data
    ? data.map(country => ({value: country, title: country.name}))
    : []

  isLoadingCountries.value = false;
}

watch(searchCountry, debounce(() => setCountries()))

</script>

<template>
  <v-select
    :class="{'mt-1': selectedCountry}"
    label="Select country"
    variant="outlined"
    density="compact"
    hide-details="auto"
    :value="selectedCountry"
    @update:modelValue="$emit('update:selectedCountry', $event)"
    :items="countries"
    :loading="isLoadingCountries"
    :no-data-text="isLoadingCountries ? 'Loading...':'No countries found'"
    @update:model-value="searchCountry = ''"
  >
    >
    <template #selection v-if="selectedCountry">{{ selectedCountry.name }}</template>
    <template #prepend-item>
      <v-list-item class="border-b">
        <v-text-field v-model="searchCountry" placeholder="Type to search" variant="plain"
                      density="compact" @keydown.space.stop
                      hide-details="auto"/>
      </v-list-item>
    </template>
    <template #append-item v-if="!searchCountry && countries.length >= fetchLimit">
      <small class=" d-block text-center">Search to see more</small>
    </template>
  </v-select>
</template>

<style scoped lang="scss">

</style>

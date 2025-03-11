<script setup>


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

// Country
const selectedCountry = defineModel();
const searchCountry = ref('')
const isLoadingCountries = ref(false);
const countries = ref(['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'])
const filteredCountries = computed(() => countries.value.filter(c => c.toLocaleLowerCase().includes(searchCountry.value.toLocaleLowerCase())))

// Cities
const selectedCities = ref([]);
const searchCity = ref('')
const isLoadingCities = ref(false);
const cities = ref(['Tel Aviv', 'Haifa', 'Rishon']);
const filteredCities = computed(() => cities.value.filter(c => c.toLocaleLowerCase().includes(searchCity.value.toLocaleLowerCase())))

</script>

<template>
  <div class="country py-2 border-b d-flex ga-3">
    <div class="w-100">
      <v-select
        :class="{'mt-1': selectedCountry}"
        label="Select country"
        variant="outlined"
        density="compact"
        hide-details="auto"
        v-model="selectedCountry"
        :items="filteredCountries"
        :loading="isLoadingCountries"
        no-data-text="No countries found"
      >
        <template #prepend-item>
          <div class="px-4 pb-1 border-b">
            <v-text-field v-model="searchCountry" placeholder="Type to search" variant="plain" density="compact"
                          hide-details="auto"></v-text-field>
          </div>
        </template>

      </v-select>
      <v-select
        v-if="selectedCountry"
        :class="{'mt-2': !selectedCities.length, 'mt-3': selectedCities.length}"
        label="Select cities"
        variant="outlined"
        density="compact"
        multiple
        hide-details="auto"
        v-model="selectedCities"
        :items="filteredCities"
        :loading="isLoadingCities"
        no-data-text="No cities found"
      >
        <template #prepend-item>
          <div class="px-4 pb-1 border-b">
            <v-text-field v-model="searchCity" placeholder="Type to search" variant="plain" density="compact"
                          hide-details="auto"></v-text-field>
          </div>
        </template>
      </v-select>
    </div>
    <v-btn icon="mdi-close" variant="plain" density="comfortable" title="Remove line" @click="removeLine"></v-btn>
  </div>
</template>

<style scoped lang="scss">
</style>

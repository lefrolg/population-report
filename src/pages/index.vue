<template>
  <v-container>
    <v-row align="stretch">
      <v-col
        cols="12"
        lg="3"
      >
        <div class="countries">
          <CountryLine
            v-for="countryId in createdLines"
            :key="countryId"
            :country-id="countryId"
            @remove-country="removeCountry"
          />
          <div
            v-if="createdLines.length < maxCountries"
            class="py-2"
          >
            <v-btn
              variant="outlined"
              @click="addCountry"
            >
              <template #prepend>
                <v-icon icon="mdi-plus" />
              </template>
              <template #default>
                Add Country
              </template>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        lg="9"
        class="position-relative"
      >
        <div class="position-sticky top-0">
          <PopulationChart />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CountryLine from "@/components/CountryLine.vue";
import {generateId} from "@/utils/generateId.js";
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";
import PopulationChart from "@/components/PopulationChart.vue";

const store = useSelectedCountriesStore();
const {maxCountries, createdLines} = storeToRefs(store)

onMounted(() => {
  addCountry()
})

function addCountry() {
  const countryId = generateId();
  store.addCountryId(countryId)
}

function removeCountry(id) {
  store.removeCountry(id)
}

</script>
<style scoped lang="scss">
</style>

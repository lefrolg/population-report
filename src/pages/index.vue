<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <div class="countries">
          <CountryLine
            v-for="countryId in createdLines"
            :key="countryId"
            :countryId="countryId"
            @remove-country="removeCountry"
          />
          <div class="py-2" v-if="createdLines.length < maxLines">
            <v-btn variant="outlined" @click="addCountry">
              <template #prepend>
                <v-icon icon="mdi-plus"></v-icon>
              </template>
              <template #default>
                Add Country
              </template>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="9">chart</v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CountryLine from "@/components/CountryLine.vue";
import {generateId} from "@/utils/generateId.js";
import colors from 'vuetify/lib/util/colors';
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";

const maxLines = ref(Object.keys(colors).length - 1);
const store = useSelectedCountriesStore();

const createdLines = computed(() => store.selectedCountriesId)

onMounted(() => {
  addCountry()
})

function addCountry() {
  const countryId = generateId();
  store.addCountry(countryId)
}

function removeCountry(id) {
  store.removeCountry(id)
}

</script>
<style scoped lang="scss">
</style>

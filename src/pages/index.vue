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

const createdLines = ref([generateId()]);
const maxLines = ref(Object.keys(colors).length - 1);

function addCountry() {
  createdLines.value.push(generateId());
}

function removeCountry(id) {
  createdLines.value.splice(createdLines.value.indexOf(id), 1);
}

</script>
<style scoped lang="scss">
</style>

<script setup>
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

// filter

const filterSizeOptions = [1000, 10000, 100000, 500000, 1000000];
const itemProps = (size) => ({
 value: size,
 title: size.toLocaleString("en-US", {notation: "compact"})
})
const citySize = defineModel();
const comparisonType = ref();

// chart

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale, ChartDataLabels)

const store = useSelectedCountriesStore();
const {selectedDataWithCities: selectedData} = storeToRefs(store);

const filteredSelectedData = computed(() => {
  if (!citySize.value || !comparisonType.value) return selectedData.value;
  return selectedData.value.reduce((filteredData, country) => {
    const cities = country.cities.filter(city => comparisonType.value === 'less'
      ? city?.population <= citySize.value
      : city?.population >= citySize.value )
    if (cities.length) {
      filteredData.push({
        ...country,
        cities
      })
    }
    return filteredData;
  }, [])
})

const groupedCities = computed(() => {
  return filteredSelectedData.value.reduce((groupedCities, country) => {
    groupedCities[country.name] = country.cities;
    return groupedCities;
  }, {});
});
const countryLabels = computed(() => filteredSelectedData.value.map(country => country.name));

const datasets = computed(() => {
  const dataSetsArr = [];
  const maxCitiesCount = Math.max(...selectedData.value.map(country => country.cities.length));
  for (let i = 0; i < maxCitiesCount; i++) {
    const dataForDataset = countryLabels.value.map(countryName => {
      const city = groupedCities.value[countryName][i];
      return city ? city?.population || null : null;
    });
    dataSetsArr.push({
      data: dataForDataset,
      backgroundColor: countryLabels.value.map(countryName => {
        const city = groupedCities.value[countryName][i];
        return city ? city.color : 'transparent';
      }),
      borderRadius: {
        topLeft: 4,
        topRight: 4,
      },
      maxBarThickness: 150,
      minBarLength: 4,
    });
  }
  return dataSetsArr;
});


const chartData = computed(() => ({
  labels: countryLabels.value,
  datasets: datasets.value,
}));

function getBarLabelName(labelIndex, datasetIndex) {
  const countryName = countryLabels.value[labelIndex];
  const city = groupedCities.value[countryName][datasetIndex];
  return city ? city.name : '';
}

const chartOptions = {
  maintainAspectRatio: true,
  responsive: true,
  skipNull: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString("en-US", {notation: "compact"})
      }
    },
  },
  plugins: {
    datalabels: {
      align: 'top',
      anchor: 'end',
      textAlign: 'center',
      formatter: function (value, context) {
        return getBarLabelName(context.dataIndex, context.datasetIndex).replaceAll(' ', '\n');
      },
    },
    tooltip: {
      callbacks: {
        title: ([context]) => `${getBarLabelName(context.dataIndex, context.datasetIndex)} (${context.label})`,
        label: (context) => {
          return 'Population: ' + context.formattedValue;
        },
      }
    }
  }
};

</script>

<template>

  <div class="d-flex flex-row ga-4">
    <h1>Population report</h1>
    <div class="ml-auto">
      <v-radio-group inline v-model="comparisonType">
        <v-radio label="Less" value="less"></v-radio>
        <v-radio label="More" value="more"></v-radio>
      </v-radio-group>
    </div>
    <div class="cities-size-wrapper">
      <v-select
        label="Select cities size"
        variant="outlined"
        density="compact"
        hide-details="auto"
        clearable
        v-model="citySize"
        :items="filterSizeOptions"
        :item-props="itemProps"
      ></v-select>
    </div>
  </div>
  <Bar class="chart" v-if="chartData.datasets.length" :data="chartData" :options="chartOptions"/>
  <div v-else class="chart empty d-flex align-center justify-center rounded-lg bg-grey-lighten-2">
    Select countries and cities to view the population chart
  </div>
</template>

<style scoped lang="scss">
.chart {
  max-height: 70vh;

  &.empty {
    height: 70vh;
  }
}

.cities-size-wrapper {
  width: 200px;
}
</style>

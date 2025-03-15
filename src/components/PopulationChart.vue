<script setup>
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

// filter

const filterSizeOptions = [1000, 10000, 100000, 500000, 1000000, 10000000];
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

const filteredData = computed(() => {
  if (!citySize.value || !comparisonType.value) return selectedData.value;
  return Object.fromEntries(
    Object.entries(selectedData.value).reduce((filteredData, [iso, country]) => {
      const cities = country.cities.filter(city => comparisonType.value === 'less'
        ? city?.population <= citySize.value
        : city?.population >= citySize.value)
      if (cities.length) {
        filteredData.push([iso, {...country, cities}])
      }
      return filteredData;
    }, []))
})

const countryLabels = computed(() => Object.keys(filteredData.value));

const datasets = computed(() => {
  const dataSetsArr = [];
  const maxCitiesCount = Math.max(...Object.values(selectedData.value).map(country => country.cities.length));
  for (let i = 0; i < maxCitiesCount; i++) {
    const dataForDataset = countryLabels.value.map(iso => {
      const city = filteredData.value[iso].cities[i];
      return city ? city?.population || null : null;
    });

    if (dataForDataset.length) {
      dataSetsArr.push({
        data: dataForDataset,
        backgroundColor: countryLabels.value.map(iso => {
          const city = filteredData.value[iso].cities[i];
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
  }
  return dataSetsArr;
});


const chartData = computed(() => ({
  labels: countryLabels.value,
  datasets: datasets.value,
}));

function getBarLabelName(labelIndex, datasetIndex) {
  const countryIso = countryLabels.value[labelIndex];
  const city = filteredData.value[countryIso].cities[datasetIndex];
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
    x: {
      ticks: {
        callback: (index) => {
          return Object.values(filteredData.value)[index]?.name
        }
      }
    }
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
        title: ([context]) => {
          const countryName = filteredData.value[context.label]?.name;
          return `${getBarLabelName(context.dataIndex, context.datasetIndex)} (${countryName})`
        },
        label: (context) => {
          return 'Population: ' + context.formattedValue;
        },
      }
    }
  }
};

</script>

<template>
  <div class="d-flex flex-column flex-lg-row ga-1 ga-lg-4 align-lg-center mb-1">
    <h1>Population report</h1>
    <div class="ml-auto">
      <v-radio-group
        v-model="comparisonType"
        inline
        hide-details="auto"
      >
        <v-radio
          label="Less"
          value="less"
        />
        <v-radio
          label="More"
          value="more"
        />
      </v-radio-group>
    </div>
    <div class="cities-size-wrapper my-2 ml-auto ml-lg-0">
      <v-select
        v-model="citySize"
        label="Select cities size"
        variant="outlined"
        density="compact"
        hide-details="auto"
        clearable
        :items="filterSizeOptions"
        :item-props="itemProps"
      />
    </div>
  </div>
  <Bar
    v-if="chartData.datasets.length"
    class="chart"
    :data="chartData"
    :options="chartOptions"
  />
  <div
    v-else-if="citySize"
    class="chart empty d-flex align-center justify-center rounded-lg bg-grey-lighten-2 pa-4 text-center"
  >
    No city matches your filter
  </div>
  <div
    v-else
    class="chart empty d-flex align-center justify-center rounded-lg bg-grey-lighten-2 pa-4 text-center"
  >
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

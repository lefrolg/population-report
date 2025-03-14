<script setup>
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useSelectedCountriesStore} from "@/stores/selected-countries.js";
import {storeToRefs} from "pinia";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale, ChartDataLabels)

const store = useSelectedCountriesStore();
const {selectedDataWithCities: selectedData} = storeToRefs(store);

const groupedCities = computed(() => {
  return selectedData.value.reduce((groupedCities, country) => {
    groupedCities[country.name] = country.cities;
    return groupedCities;
  }, {});
});
const countryLabels = computed(() => selectedData.value.map(country => country.name));

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
        callback: (value) => value.toLocaleString("en-US", { notation: "compact" })
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
  <Bar class="chart" v-if="chartData.datasets.length" :data="chartData" :options="chartOptions"/>
</template>

<style scoped lang="scss">
.chart {
  max-height: 70vh;
}
</style>

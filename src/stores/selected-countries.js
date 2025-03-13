// Utilities
import {defineStore} from 'pinia'
import colors from 'vuetify/lib/util/colors';

const {shades, grey, ...colorsPalette} = colors;

export const useSelectedCountriesStore = defineStore('selected-countries', () => {
  const selectedData = ref([]);

  const selectedDataWithCities = computed(() => {
    return selectedData.value.filter(country => country?.cities && country.cities.length)
  });

  // Countries
  function addCountry(id) {
    if (selectedData.value.find(country => country.id === id))
      return false;

    selectedData.value.push({
      id,
      baseColor: Object.keys(colorsPalette)[selectedData.value.length + 1],
    });
    return true;
  }

  function removeCountry(id) {
    if (selectedData.value.find(country => country.id === id)) {
      selectedData.value.splice(selectedData.value.findIndex(country => country.id === id), 1);
    }
  }

  function getCountryById(id) {
    return selectedData.value.find(country => country.id === id) || {};
  }

  function updateCountry(id, country,) {
    const countryRef = getCountryById(id);
    if (country && countryRef) {
      countryRef.name = country?.name || ''
      countryRef.iso2 = country?.iso2 || ''
      countryRef.cities = [];
    }
  }

  const selectedCountriesId = computed(() => {
    return selectedData.value.map((country) => country.id)
  });
  const selectedCountriesIso = computed(() => {
      return selectedData.value
        .filter((country) => country?.iso2)
        .map((country) => country?.iso2)
    }
  );
  const maxCountries = computed(() => Object.keys(colorsPalette).length)

  // Cities
  function updateCities(id, cities) {
    const countryRef = getCountryById(id);
    countryRef.cities = cities.map((city) => {
      const cityExisted = countryRef.cities.find(c => c.name === city.name)
      if (cityExisted) return {...cityExisted};

      const {name, population, is_capital} = city;
      const color = Object.values(colorsPalette[countryRef.baseColor])
        .find(c => !countryRef.cities.find(city => city.color === c));
      return {name, population, isCapital: is_capital, color};
    });
  }

  function getCountryCities(id) {
    const countryRef = getCountryById(id);
    return countryRef?.cities || [];
  }

  const maxCities = computed(() => Object.values(Object.values(colorsPalette)[0]).length)


  return {
    selectedDataWithCities,
    selectedData,
    maxCountries,
    addCountry,
    removeCountry,
    updateCountry,
    updateCities,
    selectedCountriesId,
    selectedCountriesIso,
    getCountryCities,
    getCountryById,
    maxCities
  }
})

// Utilities
import {defineStore} from 'pinia'

export const useSelectedCountriesStore = defineStore('selected-countries', () => {
  const selectedData = ref([]);

  function addCountry(id) {
    if (selectedData.value.find(country => country.id === id))
      return false;
    selectedData.value.push({id});
    return true;
  }

  function removeCountry(id) {
    if (selectedData.value.find(country => country.id === id)) {
      selectedData.value.splice(selectedData.value.findIndex(country => country.id === id), 1);
    }
  }

  function getCountryById(id) {
    return selectedData.value.find(country => country.id === id);
  }

  function updateCountry(id, country, cities = []) {
    const countryRef = getCountryById(id);
    if (country && countryRef) {
      countryRef.name = country?.name || ''
      countryRef.iso2 = country?.iso2 || ''
      countryRef.cities = cities
    }
  }

  function updateCities(id, cities) {
    const countryRef = getCountryById(id);
    countryRef.cities = cities.map((cities) => {
      const {name, population, is_capital} = cities;
      return {name, population, isCapital: is_capital};
    });
  }

  function getCountryCities(id) {
    const countryRef = getCountryById(id);
    return countryRef?.cities || [];
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

  return {
    selectedData,
    addCountry,
    removeCountry,
    updateCountry,
    updateCities,
    selectedCountriesId,
    selectedCountriesIso,
    getCountryCities,
    getCountryById
  }
})

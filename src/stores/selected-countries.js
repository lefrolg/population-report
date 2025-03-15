import {defineStore} from 'pinia'
import colors from 'vuetify/lib/util/colors';

export const useSelectedCountriesStore = defineStore('selected-countries', () => {
  const selectedData = ref({});
  const createdLines = ref({});

  const selectedDataWithCities = computed(() => {
    return Object.fromEntries(Object.entries(selectedData.value)
      .filter(([iso, country]) => {
        return country?.cities && country.cities.length
      }))
  });

  const {shades, grey, ...colorsPalette} = colors;

  // Countries
  function addCountryId(id) {
    createdLines.value[id] = null;
  }

  function removeCountry(id) {
    const countryIso = createdLines.value[id]
    delete createdLines.value[id]
    if (countryIso && selectedData.value[countryIso]) {
      delete selectedData.value[countryIso]
    }
  }

  function getCountryById(id) {
    const countryIso = createdLines.value[id];
    const countryRef = selectedData.value[countryIso]
    return countryIso && countryRef ? countryRef : null;
  }

  function updateCountry(id, country) {
    if (Object.keys(selectedData.value).length > maxCountries.value - 1) return;
    if (!country?.iso2 || typeof country?.iso2 !== 'string') return;
    const {iso2, name} = country;

    if (!createdLines.value[id]) createdLines.value[id] = country.iso2;
    if (!selectedData.value[iso2]) {
      selectedData.value[iso2] = {}
    }
    selectedData.value[iso2].name = name || '';
    selectedData.value[iso2].cities = [];

    const baseColor = Object.keys(colorsPalette)[Object.keys(selectedData.value).length + 1];
    selectedData.value[iso2].baseColor = baseColor;
    selectedData.value[iso2].color = colorsPalette[baseColor]?.base || '#ccc';
  }

  const selectedCountriesIso = computed(() =>  Object.keys(selectedData.value));
  const maxCountries = computed(() => Object.keys(colorsPalette).length)

  // Cities
  function updateCities(iso2, cities) {
    const countryRef = selectedData.value[iso2];
    if (!countryRef) return;
    const usedColors = countryRef.cities.map(city => city.color);

    const updatedCities = cities.map((city) => {
      const cityExisted = countryRef?.cities && countryRef.cities.find(c => c.name === city.name)
      if (cityExisted) return cityExisted;

      const {name, population, is_capital} = city;

      const color = Object.values(colorsPalette[countryRef.baseColor])
        .find(c => !usedColors.includes(c)) || '#ccc';
      return {name, population, isCapital: is_capital, color};
    });
    countryRef.cities.splice(0, countryRef.cities.length, ...updatedCities);
  }

  function getCountryCities(iso) { //
    return selectedData.value[iso]?.cities || [];
  }

  const maxCities = computed(() => Object.values(Object.values(colorsPalette)[0]).length)


  return {
    selectedDataWithCities,
    selectedData,
    createdLines,
    maxCountries,
    addCountryId,
    removeCountry,
    updateCountry,
    updateCities,
    selectedCountriesIso,
    getCountryCities,
    getCountryById,
    maxCities
  }
})

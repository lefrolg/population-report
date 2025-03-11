import apiClient from "@/services/apiClient.js";

/**
 * Get countries list by search query
 * @param name
 * @param limit
 * @returns {Promise<any|null>}
 */
export async function fetchCountry(name = '', limit = 30) {
  try {
    const response = await apiClient.get(`/country`, {
      params: {name, limit},
      transformResponse: apiClient.defaults.transformResponse.concat(function (data) {
        if (Array.isArray(data)) {
          return data.map((country) => {
            const {iso2, name} = country;
            return {iso2, name};
          })
        } else {
          return data;
        }
      })
    })
    if (response.status === 200) {
      return response.data
    }
    console.error(`Unexpected response status: ${response.status}`);
    return null;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

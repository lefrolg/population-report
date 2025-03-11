import apiClient from "@/services/apiClient.js";

/**
 * Get cities list by search query and country. Only 1 search result available for free
 * @param country
 * @param name
 * @returns {Promise<any|null>}
 */
export async function fetchCity(country, name = ''){
  try {
    const response = await apiClient.get('/city', { params: { country, name } })
    if (response.status === 200) {
      return response.data
    }
    console.error(`Unexpected response status: ${response.status}`);
    return null;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

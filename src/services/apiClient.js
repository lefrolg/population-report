import Axios from "axios";
import {setupCache, buildWebStorage} from "axios-cache-interceptor";

const apiEndpoint = import.meta.env.VITE_NINJAS_API_URL;
const apiKey = import.meta.env.VITE_NINJAS_API_KEY;

const instance = Axios.create({
  baseURL: apiEndpoint,
  headers: {
    "X-Api-Key": apiKey,
    "Content-type": "application/json",
  },
})

const apiClient = setupCache(instance, {
  headerInterpreter: false,
  cacheTakeover: false,
  storage: buildWebStorage(localStorage, 'axios-cache:'),
  ttl: 1000 * 60 * 60 * 24
});

export default apiClient;

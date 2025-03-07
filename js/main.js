import {
  getTemperatura,
  getClima,
  getPronostico,
  getUbicacion,
  cargarDataClima,
} from "./modules/api.js";

console.log(await getPronostico("culiacan"));

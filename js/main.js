import {
  getTemperatura,
  getClima,
  getPronostico,
  getUbicacion,
  cargarDataClima,
  cargarDataPronostico,
  organizarPronostico,
  dataPronostico,
} from "./modules/api.js";

async function asd(ciudad) {
  await cargarDataPronostico(ciudad);
}

asd("culiacan");

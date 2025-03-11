import {
  getTemperatura,
  getClima,
  getPronostico,
  getUbicacion,
  cargarDataClima,
  cargarDataPronostico,
  organizarPronostico,
  dataPronostico,
  getPronosticoMinima,
  getPronosticoMaxima,
  getCondicion
} from "./modules/api.js";

async function main(ciudad) {
  await cargarDataPronostico(ciudad);
  console.log(getCondicion())
}

main("culiacan");

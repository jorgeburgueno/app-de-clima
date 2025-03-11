import {
  getTemperatura,
  getClima,
  getPronostico,
  getUbicacion,
  cargarDataClima,
  cargarDataPronostico,
  organizarPronostico,
  getPronosticoMinima,
  getPronosticoMaxima,
  getCondicion,
  getDescripcionClima,
} from "./modules/api.js";

async function main(ciudad) {
  const pronostico = await cargarDataPronostico(ciudad);
  const min = getPronosticoMaxima(pronostico);

  console.log(min);
}

main("culiacan");

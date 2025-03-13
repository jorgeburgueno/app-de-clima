
import {
  getTemperatura,
  getClima,
  getPronostico,
  getUbicacion,
  cargarDataPronostico,
  organizarPronostico,
  getPronosticoMinima,
  getPronosticoMaxima,
  getCondicion,
  getDescripcionClima,
} from "./modules/api.js";
import { busquedaCiudad } from "./modules/ui.js";

async function busquedaClima(ciudad){
  try {
    const dataClima = await getClima(ciudad);
    const temperatura = await getTemperatura(dataClima);
    const description = await getDescripcionClima(dataClima);

    console.log(`el clima de ${ciudad} es de ${temperatura} ${description}`)
  } catch (error) {
    console.log('error', error)
  }
}

busquedaCiudad(busquedaClima);

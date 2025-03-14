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
  getCiudad,
  getSens,
} from "./modules/api.js";
import { busquedaCiudad, renderCiudad, renderSensacionTermica, renderTemperatura, renderFechaActual, renderDescripcion } from "./modules/ui.js";

async function busquedaClima(ciudad) {
  try {
    const dataClima = await getClima(ciudad);
    const temperatura = await getTemperatura(dataClima);
    const nombre = await getCiudad(dataClima);
    const description = await getDescripcionClima(dataClima);
    const sensacion = await getSens(dataClima);

    await renderCiudad(nombre);
    await renderTemperatura(temperatura);
    await renderSensacionTermica(sensacion);
    await renderFechaActual();
    await renderDescripcion(description)
    console.log(`el clima de ${ciudad} es de ${temperatura} ${description}`);
  } catch (error) {
    console.log("error", error);
  }
}

busquedaCiudad(busquedaClima);

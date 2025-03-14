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
import {
  busquedaCiudad,
  renderCiudad,
  renderSensacionTermica,
  renderTemperatura,
  renderFechaActual,
  renderDescripcion,
  renderDiaPronostico
} from "./modules/ui.js";

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
    await renderDescripcion(description);

    
  } catch (error) {
    console.log("error", error);
  }
}

async function busquedaPronostico(ciudad) {
  try {    
    const dataPronostico = await getPronostico(ciudad)
    const organizar = await organizarPronostico(dataPronostico)
    
    organizar.forEach((element, index) => {
      renderDiaPronostico(element.fecha, index)
    });
   
    
    console.log(organizar);
  } catch (error) {
    console.log("error", error);
  }
}

busquedaCiudad(busquedaClima);
busquedaCiudad(busquedaPronostico);
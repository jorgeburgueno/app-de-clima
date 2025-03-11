const API_KEY = config.API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

let dataClima = null;
export let dataPronostico = null;

export async function getClima(ciudad) {
  try {
    const respuesta = await fetch(
      `${BASE_URL}/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    );

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    let data = await respuesta.json();

    return data;
  } catch (error) {
    console.error("No se tuvo respuesta", error.message);
    throw error;
  }
}

export async function cargarDataClima(ciudad) {
  dataClima = await getClima(ciudad);
}

export async function getTemperatura() {
  return dataClima?.main?.temp;
}

export async function getDescripcionClima() {
  return await dataClima?.weather[0]?.description;
}

// Pronosticos

export async function getPronostico(ciudad) {
  let coords = await getCoordenadas(ciudad);

  try {
    const respuesta = await fetch(
      `${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=es`
    );

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    let data = await respuesta.json();
    return data.list;
  } catch (error) {
    console.error("No se tuvo respuesta", error.message);
    throw error;
  }
}

export async function cargarDataPronostico(ciudad) {
  try {
    const pronostico = await getPronostico(ciudad);
    await organizarPronostico(pronostico);
  } catch (error) {
    console.error("Error al cargar el pronóstico", error.message);
    throw error;
  }
}

export async function organizarPronostico(pronostico) {
  const pronosticoPorDia = {};

  pronostico.forEach((element) => {
    const fecha = element.dt_txt.split(" ")[0];

    if (!pronosticoPorDia[fecha]) {
      pronosticoPorDia[fecha] = {
        temps: [element.main.temp],
        condiciones: [element.weather[0].main],
      };
    } else {
      pronosticoPorDia[fecha].temps.push(element.main.temp);
      pronosticoPorDia[fecha].condiciones.push(element.weather[0].main);
    }
  });

  const agrupado = Object.keys(pronosticoPorDia).map((fecha) => {
    const temps = pronosticoPorDia[fecha].temps;
    const condiciones = pronosticoPorDia[fecha].condiciones;

    const condicion = condiciones.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const condicionMasFrecuente = Object.keys(condicion).reduce((a, b) =>
      condicion[a] > condicion[b] ? a : b
    );

    return {
      fecha: fecha,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      condicion: condicionMasFrecuente,
    };
  });
  dataPronostico = agrupado;
  console.log(dataPronostico)
}

// obtener ubicacion

export async function getCoordenadas(ciudad) {
  try {
    const respuesta = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${ciudad}&limit=1&appid=${API_KEY}`
    );

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }
    let data = await respuesta.json();

    return data[0];
  } catch (error) {
    console.error("No se tuvo respuesta", error.message);
    throw error;
  }
}

export async function getClimaPorUbicacion(lat, lon) {
  try {
    const respuesta = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
    );

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el clima:", error.message);
    throw error;
  }
}
// api de geolocalizacion

export function getUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;

        try {
          const clima = await getClimaPorUbicacion(lat, lon);
        } catch (error) {
          console.log("No se pudo obtener el clima por ubicación.");
        }
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error.message);
      }
    );
  } else {
    console.log("Geolocalización no es compatible con este navegador.");
  }
}

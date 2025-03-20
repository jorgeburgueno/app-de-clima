export function busquedaCiudad(callback) {
  const busquedaInput = document.querySelector(".busqueda-input");
  const busquedaBtn = document.querySelector(".busqueda-btn");

  busquedaBtn.addEventListener("click", async () => {
    const ciudad = busquedaInput.value;
    callback(ciudad);
  });

  busquedaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const ciudad = busquedaInput.value;
      callback(ciudad);
    }
  });
}
// Render carta principal de clima
export function renderCiudad(ciudad) {
  const cardCiudad = document.querySelector(".card__ciudad");

  cardCiudad.textContent = ciudad;
}

export function renderTemperatura(temperatura) {
  const cardTemp = document.querySelector(".card__temp");
  cardTemp.textContent = `Temperatura actual: ${temperatura}°C`;
}

export function renderSensacionTermica(sensacion) {
  const cardSens = document.querySelector(".card__sens");
  cardSens.textContent = `Sensacion termica: ${sensacion}°C`;
}

export function renderFechaActual() {
  const fecha = new Date();
  const cardFecha = document.querySelector(".card__fecha");

  cardFecha.textContent = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function renderDescripcion(description) {
  const cardDescription = document.querySelector(".card__desc");

  cardDescription.textContent = description;
}

// Render el pronostico de 5 dias

export function renderDiaPronostico(fecha, index) {
  const pronosticoDia = document.querySelectorAll(".pronostico__dia__nombre");

  if (pronosticoDia[index]) {
    pronosticoDia[index].textContent = getNombreDia(fecha);
  }
}

export function getNombreDia(fecha) {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const [year, month, day] = fecha.split("-").map(Number);
  const fechaObj = new Date(year, month - 1, day);
  return dias[fechaObj.getDay()];
}

export function renderTemperaturaMax(temp, index) {
  const pronosticoMax = document.querySelectorAll(".pronostico__temp__max");

  if (pronosticoMax[index]) {
    pronosticoMax[index].textContent = temp;
  }
}

export function renderTemperaturaMin(temp, index) {
  const pronosticoMin = document.querySelectorAll(".pronostico__temp__min");

  if (pronosticoMin[index]) {
    pronosticoMin[index].textContent = temp;
  }
}

export function renderIcono(codigo, index) {
  const icono = document.querySelectorAll(".pronostico__icono");
  if (icono[index]) {
    const iconoDia = codigo.endsWith("n") ? codigo.replace("n", "d") : codigo;

    icono[index].src = `https://openweathermap.org/img/wn/${iconoDia}@2x.png`;
    icono[index].alt = `icono del clima`;
  }
}

let chart = null;
export function renderChart(dataPronostico) {
  const ctx = document.getElementById("myChart");

  if (!ctx) return;

  const label = [];
  const temp = [];

  if (chart) {
    chart.destroy();
  }

  for (let i = 0; i < Math.min(dataPronostico.length, 8); i++) {
    const time = dataPronostico[i].dt_txt.split(" ")[1].substr(0, 5);
    label.push(time);
    temp.push(dataPronostico[i].main.temp);
  }

  const data = {
    labels: label,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temp,
        borderColor: "#4a6cf7",
        backgroundColor: "rgba(74, 108, 247, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#4a6cf7",
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  chart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y + "°C";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

export function navegacion() {
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = {
    Hoy: document.querySelector(".card"),
    "Temperatura por Hora": document.querySelector(".grafica"),
    "Pronostico Semanal": document.querySelector(".pronostico"),
  };
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetText = this.textContent.trim();
      const targetSection = sections[targetText];

      if (targetSection) {
        const offset = 60;
        const targetPosition = targetSection.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

export function autocompletar() {
  const busquedaInput = document.querySelector(".busqueda-input");
  const API_KEY = config.API_KEY;
  let contenedorSugerencia;
  let timer;

  const sugerenciaCache = {};

  function crearContenedorSugerencia() {
    contenedorSugerencia = document.createElement("div");
    contenedorSugerencia.className = "contenedor-sugerencia";
    busquedaInput.parentNode.appendChild(contenedorSugerencia);
    contenedorSugerencia.style.position = "absolute";
    contenedorSugerencia.style.top = `${busquedaInput.offsetTop + busquedaInput.offsetHeight}px`;
    contenedorSugerencia.style.left = `${busquedaInput.offsetLeft}px`;
    contenedorSugerencia.style.width = `${busquedaInput.offsetWidth}px`;
    contenedorSugerencia.style.display = "none";
    contenedorSugerencia.style.zIndex = "1000";
  }

  busquedaInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if (!query) {
      contenedorSugerencia.style.display = "none";
      return;
    }

    if (query.length < 3) return;

    clearTimeout(timer);

    timer = setTimeout(async () => {
      if (sugerenciaCache[query]) {
        displaySugerencia(sugerenciaCache[query]);
        return;
      }
      try {
        const respuesta = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }

        const ciudad = await respuesta.json();
        sugerenciaCache[query] = ciudad;

        displaySugerencia(ciudad);
      } catch (error) {
        console.log("no se pudo obtener la ciudad", error);
      }
    }, 500);
  });

  function displaySugerencia(ciudad) {
    contenedorSugerencia.innerHTML = "";

    if (ciudad.length > 0) {
      ciudad.forEach((city) => {
        const sugerencia = document.createElement("div");
        sugerencia.className = "sugerencia-item";
        sugerencia.textContent = `${city.name}, ${city.country}`;
        sugerencia.addEventListener("click", () => {
          busquedaInput.value = city.name;
          contenedorSugerencia.style.display = "none";

          const busquedaEvento = new Event("search");
          busquedaInput.dispatchEvent(busquedaEvento);
        });

        contenedorSugerencia.appendChild(sugerencia);
      });

      contenedorSugerencia.style.display = "block";
    } else {
      contenedorSugerencia.style.display = "none";
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target !== busquedaInput && e.target !== contenedorSugerencia) {
      contenedorSugerencia.style.display = "none";
    }
  });

  busquedaInput.addEventListener("search", () => {
    const searchBtn = document.querySelector(".busqueda-btn");
    searchBtn.click();
  });

  crearContenedorSugerencia();
}

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
  const label = [];
  const temp = [];

  if (chart) {
    chart.destroy();
  }
  for (let i = 0; i < 8; i++) {
    label.push(dataPronostico[i].dt_txt.split(" ")[1]);
    temp.push(dataPronostico[i].main.temp);
  }
  const data = {
    labels: label,
    datasets: [
      {
        label: "Temperatura",
        data: temp,
      },
    ],
  };

  chart = new Chart(ctx, {
    type: "line",
    data: data,
  });
}

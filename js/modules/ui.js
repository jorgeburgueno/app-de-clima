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

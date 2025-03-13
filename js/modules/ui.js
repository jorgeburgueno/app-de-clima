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

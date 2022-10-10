import { error, warning } from "./SweetAlert.js"

// SESSION STORAGE
export const storage = () => {
  
  

  //VENTANA DE INICIO DE SESION (MODAL)
  const btnAbrirModal = document.querySelector("#btn-abrir-modal");
  const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
  const modal = document.querySelector("#modal");
  btnAbrirModal.addEventListener("click", () => {
    modal.showModal();
  });
  // btnCerrarModal.addEventListener("click", () => {
  //   modal.close();
  // });
};

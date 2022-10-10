export const agotado = () => {
  Swal.fire("Producto Agotado");
};

export const addCorrect = () => {
  Swal.fire("Agregado Correctamente");
};

export const sinStock = () => {
  Swal.fire("Sin Stock");
};

export const thanks = () => {
  Swal.fire({
    title: "¡¡¡GRACIAS POR SU COMPRA!!!",
    imageUrl: "./imgs/buycart.jpg",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "BUY CART",
  });
};

export const error = () => {
  Swal.fire({
    icon: "error",
    title: "Los campos no pueden estar vacios",
  });
};

export const warning = () => {
  Swal.fire({
    icon: "warning",
    title: "No hay ninguna sesion abierta",
  });
};
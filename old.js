const FunctionPedir = () => {
  //Array de Objetos!! Productos en Stock!!
  const productos = [
    {
      id: "1",
      nombre: "banana",
      precio: "220",
      tipo: "fruta",
    },
    {
      id: "2",
      nombre: "frutilla",
      precio: "1200",
      tipo: "fruta",
    },
    {
      id: "3",
      nombre: "papa",
      precio: "130",
      tipo: "verdura",
    },
    {
      id: "4",
      nombre: "kiwi",
      precio: "300",
      tipo: "fruta",
    },
  ];

  //Inicia el programa
  alert("Este era el metodo con prompt y alert")
  alert("🛒 Carrito de Compras 🛒");

  //Metodo de busqueda para que devuelva el nombre y el ID de los productos disponibles
  let productosDisponibles = productos
    .map(
      (producto) =>
        `${producto.nombre}   ID:${
          producto.id
        }   El precio por kg es de: ${numberToCurrency(producto.precio)}\n`
    )
    .join("");

  //En esta parte pedimos al usuario por medio de un prompt que elija un producto!!!
  let pedirProducto = prompt(
    `Productos Disponibles:
${productosDisponibles}
Por favor escriba el ID del producto (ej: 1 para banana)
Si desea salir por favor escriba "salir"
`,
    "1"
  );

  //Algoritmo
  if (pedirProducto <= 4 && pedirProducto >= 1) {
    let precioProducto = productos[pedirProducto - 1].precio;
    console.log("FUNCIONO!");
    let respuesta =
      prompt(`El precio por kg de ${productos[pedirProducto - 1].nombre} es de: ${precioProducto}
  Cuantos KG desea comprar?`);
    if (respuesta) {
      alert(
        `Usted compro ${respuesta} kg de ${productos[pedirProducto - 1].nombre} por ${
          precioProducto * respuesta
        }`
      );
    }
  } else if (pedirProducto > 4 || pedirProducto < 1) {
    alert("Ese producto no esta en la lista");
    pedirProducto;
  } else if (pedirProducto === "salir") {
    functSalir();
  }

  //Funcion para terminar el programa escribiendo salir!!
  function functSalir() {
    while (pedirProducto == "salir") {
      break;
    }
    alert("Gracias, espero vuelvas pronto!!");
  }
  //Fin del programa!!
};

//Para imprimir precio como si fueran Pesos Argentinos en este caso
function numberToCurrency(n) {
  return new Intl.NumberFormat("es-AR", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "ars",
  }).format(n);
}
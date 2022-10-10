import { storage } from "./localStorage.js";
import { upArrow } from "./upArrow.js";
import { addCorrect, agotado, sinStock, thanks, error, warning } from "./SweetAlert.js"

const app = async () => {
  let productos = await obtenerProductosDb();

  //Obtener los productos con fetch desde un JSON
  async function obtenerProductosDb() {
    const misProductos = "./db.json";
    return fetch(misProductos)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //Mi base de datos con sus metodos para llamar
  const db = {
    metodos: {
      find: (id) => {
        return db.productos.find((producto) => producto.id == id);
      },
      remove: (productos) => {
        productos.forEach((producto) => {
          const product = db.metodos.find(producto.id);
          product.cantidad = product.cantidad - producto.cantidad;
        });
      },
    },
    productos,
  };

  const carritoDeCompra = {
    productos: [],
    metodos: {
      add: (id, cantidad) => {
        const productoCarrito = carritoDeCompra.metodos.get(id);
        if (productoCarrito) {
          if (
            carritoDeCompra.metodos.hasInventory(
              id,
              cantidad + productoCarrito.cantidad
            )
          ) {
            productoCarrito.cantidad += cantidad;
          } else {
            //UTILIZANDO SweetAlert
            agotado();
          }
        } else {
          carritoDeCompra.productos.push({ id, cantidad });
        }
      },

      remove: (id, cantidad) => {
        const productoCarrito = carritoDeCompra.metodos.get(id);
        if (productoCarrito.cantidad - cantidad > 0) {
          productoCarrito.cantidad -= cantidad;
        } else {
          carritoDeCompra.productos = carritoDeCompra.productos.filter(
            (producto) => producto.id != id
          );
        }
      },

      count: () => {
        return carritoDeCompra.productos.reduce(
          (acc, producto) => acc + producto.cantidad,
          0
        );
      },

      get: (id) => {
        const index = carritoDeCompra.productos.findIndex(
          (producto) => producto.id == id
        );
        return index >= 0 ? carritoDeCompra.productos[index] : null;
      },

      getTotal: () => {
        const total = carritoDeCompra.productos.reduce((acc, producto) => {
          const found = db.metodos.find(producto.id);
          return acc + found.precio * producto.cantidad;
        }, 0);
        return total;
      },

      hasInventory: (id, cantidad) => {
        return (
          db.productos.find((producto) => producto.id == id).cantidad -
            cantidad >=
          0
        );
      },

      save: () => {
        localStorage.setItem(user, JSON.stringify(carritoDeCompra.productos));
        carritoDeCompra.productos = [];
      },

      buy: () => {
        db.metodos.remove(carritoDeCompra.productos);
        carritoDeCompra.productos = [];
      },
    },
  };

  shop();

  function shop() {
    const html = db.productos.map((producto) => {
      return `
    <div class="producto">
      <img class="imagen" src="${producto.image}" alt="${producto.nombre}">
      <div class="nombre">${producto.nombre}</div>
      <div class="precio">${numberToCurrency(producto.precio)} / kg</div>
      <div class="cantidad">${producto.cantidad} kgs Disponibles</div>

      <div class="actions">
        <button 
        class="add" 
        data-id="${producto.id}">
        Añadir al carrito</button>
      </div>
    </div>
    `;
    });

    document.querySelector("#store-container").innerHTML = html.join("");

    //listener para nuestros botones
    document.querySelectorAll(".producto .actions .add").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        const producto = db.metodos.find(id);
        //Si al decrementar el producto sigue siendo mayor a 0, puedo añadir mas.
        if (producto && producto.cantidad - 1 > 0) {
          //añadir a Carrito de Compra
          carritoDeCompra.metodos.add(id, 1);
          //UTILIZANDO SweetAlert
          addCorrect()

          shopingCart();
        } else {
          //UTILIZANDO SweetAlert
          sinStock()
        }
      });
    });
  }

  function shopingCart() {
    const html = carritoDeCompra.productos.map((producto) => {
      const dbproducto = db.metodos.find(producto.id);
      return `
      <div class="producto">
        <div class="nombre">${dbproducto.nombre}</div>
        <div class="precio">${numberToCurrency(dbproducto.precio)}</div>
        <div class="cantidad">${producto.cantidad} kg comprados! </div>
        <div class="subtotal">
        SubTotal:${numberToCurrency(producto.cantidad * dbproducto.precio)} 
        </div>
        <div class="actions">
          <button class="agregarUno" data-id="${producto.id}">+</button>
          <button class="eliminarUno" data-id="${producto.id}">-</button>
        </div>
      </div>
    `;
    });

    const closeButton = `
    <div class="cart-header">
      <button class="buttonCerrar">Cerrar</button>
    </div>
  `;
    const comprarButton =
      carritoDeCompra.productos.length > 0
        ? `
    <div class="cart-actions">
      <button class="bCompra" id="bCompra">comprar</button>
    </div>
  `
        : "";

    const total = carritoDeCompra.metodos.getTotal();
    const totalContainer = `
    <div class="total" >
    Total: ${numberToCurrency(total)}
    </div>
  `;

    const carritoDeCompraContainer = document.querySelector(
      "#carrito-compra-container"
    );
    carritoDeCompraContainer.classList.remove("hide");
    carritoDeCompraContainer.classList.add("show");

    carritoDeCompraContainer.innerHTML =
      closeButton + html.join("") + totalContainer + comprarButton;

    document.querySelectorAll(".agregarUno").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        carritoDeCompra.metodos.add(id, 1);
        shopingCart();
      });
    });

    document.querySelectorAll(".eliminarUno").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        carritoDeCompra.metodos.remove(id, 1);
        shopingCart();
      });
    });

    document.querySelector(".buttonCerrar").addEventListener("click", (e) => {
      carritoDeCompraContainer.classList.remove("show");
      carritoDeCompraContainer.classList.add("hide");
    });

    const bCompra = document.querySelector("#bCompra");
    if (bCompra) {
      bCompra.addEventListener("click", (e) => {
        carritoDeCompra.metodos.buy();
        shop();
        //UTILIZANDO SweetAlert
        thanks()

        shopingCart();
      });
    }
  }

  //Para imprimir el precio como si fueran Pesos Argentinos en este caso
  function numberToCurrency(n) {
    return new Intl.NumberFormat("es-AR", {
      maximumSignificantDigits: 2,
      style: "currency",
      currency: "ars",
    }).format(n);
  }

  //Storage
  const user = document.querySelector("#user");
  const password = document.querySelector("#password");

  let userLogin;
  let passwordLogin;

  user.addEventListener("input", (e) => {
    userLogin = e.target.value;
  });
  password.addEventListener("input", (e) => {
    passwordLogin = e.target.value;
  });

  function limpiar() {
    document.querySelector("#user").value = "";
    document.querySelector("#password").value = "";
  }

  const botonLogin = document.querySelector("#buttonLogin");
  const botonLogout = document.querySelector("#buttonLogout");

  botonLogin.addEventListener("click", () => {
    if (user && password.value.length == 0) {
      //UTILIZANDO SweetAlert
      error()

    } else {
      login();
    }
  });

  botonLogout.addEventListener("click", () => {
    if (user && password.value.length == 0) {
      //UTILIZANDO SweetAlert
      warning()

    } else {
      logout();
      setTimeout(function () {
        console.clear();
      }, 5000);
    }
  });

  const login = () => {
    if (user === "" && password === "") {
      return;
    } else {
      console.log("Ingreso Correctamente");
      //UTILIZANDO SweetAlert
      Swal.fire({
        icon: "success",
        title: `Bievenido ${userLogin}`,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ user: userLogin, password: passwordLogin })
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    if (user && password != null) {
      console.log("Session Cerrada");
      //UTILIZANDO SweetAlert
      Swal.fire(`Vuelve Pronto! ${userLogin}`);

      limpiar();
    }
  };
};

app();

storage();
upArrow();
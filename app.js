//T7-2022630205 | Alicia Cortés Gamboa

//Requerimiento No funcional 4
function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.style.display = 'none';
    });
    document.getElementById(id).style.display = 'block';

    if (id === 'carritoCompra') {
        cargarCarrito();
    }
}

async function registrarArticulo(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombreArticulo").value;
    const descripcion = document.getElementById("descripcionArticulo").value;
    const precio = parseFloat(document.getElementById("precioArticulo").value);
    const cantidad = parseInt(document.getElementById("cantidadArticulo").value);
    const fotoInput = document.getElementById("fotoArticulo");

    let fotoBase64 = "";
    if (fotoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = async () => {
            fotoBase64 = reader.result.split(",")[1];
            await cliente.postJson("AltaArticulo", { nombre, descripcion, precio, cantidad, foto: fotoBase64 });
            alert("Artículo registrado correctamente");
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        await cliente.postJson("AltaArticulo", { nombre, descripcion, precio, cantidad, foto: fotoBase64 });
        alert("Artículo registrado correctamente");
    }
}

async function buscarArticulos() {
    const palabraClave = document.getElementById("busqueda").value;
    const resultados = await cliente.postJson("BuscarArticulo", { palabraClave });
    mostrarResultados(resultados);
}

//Requisito 9: Desplegamos los datos del articulo | Botón de compra e input de cantidad
function mostrarResultados(articulos) {
    const contenedor = document.getElementById("resultadosArticulos");
    contenedor.innerHTML = "";
    articulos.forEach(articulo => {
        const div = document.createElement("div");
        div.className = "articulo";
        div.innerHTML = `
            <img class="miniatura" src="data:image/jpeg;base64,${articulo.foto}" alt="Foto del artículo" style="padding-right: 20px;">
            <h3 style="padding-right: 20px;">${articulo.nombre}</h3>
            <p style="padding-right: 20px;">Descripción: ${articulo.descripcion}</p>
            <p style="padding-right: 20px;">Precio: $${articulo.precio}</p>
            <input style="padding-right: 10px;" type="number" value="1" id="cantidad-${articulo.id_articulo}">
            <button class="elegant-button2" style="margin-left: 10px;" onclick="comprarArticulo(${articulo.id_articulo})">✔ Comprar</button>
        `;
        contenedor.appendChild(div);
    });
}

//Requisito 10: Se realiza la compra del articulo
async function comprarArticulo(idArticulo) {
    const cantidad = parseInt(document.getElementById(`cantidad-${idArticulo}`).value);
    const respuesta = await cliente.postJson("ComprarArticulo", { id_articulo: idArticulo, cantidad });
    alert(respuesta.mensaje || respuesta.error);
}

async function cargarCarrito() {
    console.log("Cargando carrito...");

    try {
        //Realizamos la solicitud POST
        const carrito = await cliente.postJson("ObtenerCarrito", {});
        
        console.log("Respuesta de carrito:", carrito);

        if (!carrito || carrito.length === 0) {
            document.getElementById("articulosCarrito").innerHTML = "<p>➞ El carrito está vacío</p>";
            return;
        }

        const contenedor = document.getElementById("articulosCarrito");
        contenedor.innerHTML = "";

        let totalGeneral = 0;

        carrito.forEach(articulo => {
            const costo = articulo.precio * articulo.cantidad;
            totalGeneral += costo;

            const articuloDiv = document.createElement("div");
            articuloDiv.classList.add("articulo");

            //Requisito 12: Cada articulo incluye un botón de eliminar articulo
            articuloDiv.innerHTML = `
                <img src="data:image/jpeg;base64,${articulo.foto}" alt="${articulo.nombre}" class="miniatura">
                <div class="detalle">
                    <h4>${articulo.nombre}</h4>
                    <p>${articulo.descripcion}</p>
                    <p>Precio: $${articulo.precio.toFixed(2)}</p>
                    <p>Cantidad: ${articulo.cantidad}</p>
                    <p>Costo: $${costo.toFixed(2)}</p>
                </div>
                <button class="elegant-button2" onclick="eliminarArticulo(${articulo.id_articulo})">Eliminar</button>
            `;

            contenedor.appendChild(articuloDiv);
        });

        const totalDiv = document.createElement("div");
        totalDiv.classList.add("total");
        totalDiv.innerHTML = `<h3>Total: $${totalGeneral.toFixed(2)}</h3>`;
        contenedor.appendChild(totalDiv);

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        alert("Hubo un error al cargar el carrito.");
    }
}

async function eliminarArticulo(idArticulo) {
    try {
        const response = await cliente.postJson("EliminarArticulo", { id_articulo: idArticulo });
        if (response.mensaje) {
            alert(response.mensaje);
            cargarCarrito();
        }
    } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        alert("Hubo un error al eliminar el artículo.");
    }
}

async function vaciarCarrito() {
    await cliente.postJson("VaciarCarrito", {});
    cargarCarrito();
}
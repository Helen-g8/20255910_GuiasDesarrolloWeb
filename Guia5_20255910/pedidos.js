const pedidos = [];

const formPedido = document.getElementById("formPedido");
const inputProducto = document.getElementById("producto");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");
const inputPrecioMaximo = document.getElementById("precioMaximo");
const mensajeError = document.getElementById("mensajeError");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const totalUnidadesEl = document.getElementById("totalUnidades");
const montoTotalEl = document.getElementById("montoTotal");


function validarPedido(producto, precio, cantidad) {
  const errores = [];
  if (producto.trim() === "") errores.push("El nombre del producto no puede estar vacío.");
  if (!Number.isFinite(precio) || precio <= 0) errores.push("El precio debe ser un número mayor que cero.");
  if (!Number.isInteger(cantidad) || cantidad <= 0) errores.push("La cantidad debe ser un número entero positivo.");
  return errores;
}

function crearPedido(producto, precio, cantidad) {
  return { producto: producto.trim(), precio, cantidad };
}

function calcularSubtotal(pedido) {
  return pedido.precio * pedido.cantidad;
}

function filtrarPorPrecioMaximo(lista, maximo) {
  return lista.filter(pedido => pedido.precio <= maximo);
}

function calcularTotalUnidades(lista) {
  return lista.reduce((acumulado, pedido) => acumulado + pedido.cantidad, 0);
}

function calcularMontoTotal(lista) {
  return lista.map(calcularSubtotal).reduce((acumulado, subtotal) => acumulado + subtotal, 0);
}

function formatearMoneda(valor) {
  return `$${valor.toFixed(2)}`;
}



function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function generarFilaHTML(pedido) {
  return `
    <tr>
      <td>${escaparHTML(pedido.producto)}</td>
      <td class="text-end">${formatearMoneda(pedido.precio)}</td>
      <td class="text-end">${pedido.cantidad}</td>
      <td class="text-end">${formatearMoneda(calcularSubtotal(pedido))}</td>
    </tr>`;
}

function renderizarTabla(lista) {
  cuerpoTabla.innerHTML = lista.length > 0
    ? lista.map(generarFilaHTML).join("")
    : `<tr><td colspan="4" class="text-center text-muted py-3">No hay pedidos para mostrar.</td></tr>`;
}


function renderizarIndicadores(lista) {
  totalUnidadesEl.textContent = calcularTotalUnidades(lista);
  montoTotalEl.textContent = formatearMoneda(calcularMontoTotal(lista));
}

function mostrarErrores(errores) {
  mensajeError.innerHTML = errores.map(escaparHTML).join("<br>");
  mensajeError.classList.toggle("d-none", errores.length === 0);
}

function actualizarVista(listaVisible = pedidos) {
  renderizarTabla(listaVisible);
  renderizarIndicadores(pedidos);
}


function manejarAgregarPedido(evento) {
  evento.preventDefault();

  const producto = inputProducto.value;
  const precio = parseFloat(inputPrecio.value);
  const cantidad = Number(inputCantidad.value);

  const errores = validarPedido(producto, precio, cantidad);
  mostrarErrores(errores);
  if (errores.length > 0) return;

  pedidos.push(crearPedido(producto, precio, cantidad));
  formPedido.reset();
  inputProducto.focus();
  actualizarVista();
}

function manejarFiltrar() {
  const maximo = parseFloat(inputPrecioMaximo.value);
  if (!Number.isFinite(maximo) || maximo < 0) {
    mostrarErrores(["Ingrese un precio máximo válido para filtrar."]);
    return;
  }
  mostrarErrores([]);

  actualizarVista(filtrarPorPrecioMaximo(pedidos, maximo));
}

function manejarMostrarTodos() {
  inputPrecioMaximo.value = "";
  mostrarErrores([]);
  actualizarVista();
}

function manejarLimpiar() {
  pedidos.length = 0;
  inputPrecioMaximo.value = "";
  mostrarErrores([]);
  actualizarVista();
}


formPedido.addEventListener("submit", manejarAgregarPedido);
document.getElementById("btnFiltrar").addEventListener("click", manejarFiltrar);
document.getElementById("btnMostrarTodos").addEventListener("click", manejarMostrarTodos);
document.getElementById("btnLimpiar").addEventListener("click", manejarLimpiar);

actualizarVista();
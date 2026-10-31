const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

const idModal = document.getElementById("idModal");

const CLAVE_STORAGE = "pacientes";

// Carga lo guardado; si no hay nada (o está dañado), devuelve un arreglo vacío
const cargarDesdeStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
  } catch (error) {
    return [];
  }
};

const guardarEnStorage = () => {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(arrayPaciente));
};

let arrayPaciente = cargarDesdeStorage(); // <-- antes era []
let indiceEditando = null; // <-- GLOBAL: null = modo agregar, número = modo editar

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  // si el usuario limpia, se cancela cualquier edición en curso
  indiceEditando = null;
  buttonAgregarPaciente.innerHTML =
    '<i class="bi bi-person-plus-fill"></i> Guardar Datos';

  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
        const registro = [nombre, apellido, fechaNacimiento, sexo, labelPais, direccion];

    if (indiceEditando !== null) {
      // MODO EDITAR
      arrayPaciente[indiceEditando] = registro;
      mensaje.innerHTML = "Paciente actualizado correctamente";
    } else {
      // MODO AGREGAR
      arrayPaciente.push(registro);
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    }

    guardarEnStorage();
    toast.show();
    limpiarForm();
    imprimirPacientes(); // refresca la tabla en ambos casos
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

// Carga los datos de un paciente en el formulario para editarlo
const cargarPaciente = (index) => {
  const p = arrayPaciente[index];
  inputNombre.value = p[0];
  inputApellido.value = p[1];
  inputFechaNacimiento.value = p[2];
  inputRdMasculino.checked = p[3] === "Hombre";
  inputRdFemenino.checked = p[3] === "Mujer";
  // buscar el país por su texto
  for (let opt of cmbPais.options) {
    if (opt.text === p[4]) cmbPais.value = opt.value;
  }
  inputDireccion.value = p[5];

  indiceEditando = index;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-save"></i> Actualizar';
  inputNombre.focus();
};

// Solo arma las filas, nada más
function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, index) => {
    $fila += `<tr>
      <td scope="row" class="text-center fw-bold">${contador}</td>
      <td>${element[0]}</td>
      <td>${element[1]}</td>
      <td>${element[2]}</td>
      <td>${element[3]}</td>
      <td>${element[4]}</td>
      <td>${element[5]}</td>
      <td>
        <button type="button" class="btn btn-primary btn-editar" data-index="${index}" title="Editar">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button type="button" class="btn btn-danger btn-eliminar" data-index="${index}" title="Eliminar">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  let $table = `<div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <tr>
          <th scope="col" class="text-center" style="width:5%">#</th>
          <th scope="col" class="text-center" style="width:15%">Nombre</th>
          <th scope="col" class="text-center" style="width:15%">Apellido</th>
          <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
          <th scope="col" class="text-center" style="width:10%">Sexo</th>
          <th scope="col" class="text-center" style="width:10%">Pais</th>
          <th scope="col" class="text-center" style="width:25%">Dirección</th>
          <th scope="col" class="text-center" style="width:10%">Opciones</th>
        </tr>
        ${imprimirFilas()}
      </table>
    </div>
  `;
  document.getElementById("idTablaPacientes").innerHTML = $table;
};

document.getElementById("idTablaPacientes").addEventListener("click", (e) => {
  const btnEliminar = e.target.closest(".btn-eliminar");
  const btnEditar = e.target.closest(".btn-editar");

  if (btnEliminar) {
    const index = parseInt(btnEliminar.dataset.index);
    if (confirm("¿Desea eliminar este paciente?")) {
      arrayPaciente.splice(index, 1);
      guardarEnStorage();
      if (indiceEditando === index) limpiarForm();
      imprimirPacientes();
    }
  }

  if (btnEditar) {
    const index = parseInt(btnEditar.dataset.index);
    cargarPaciente(index);
  }
});

let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value;

  if (paisNew != "") {
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;
    contadorGlobalOption++; 

    cmbPais.appendChild(option);
    mensaje.innerHTML = "Pais agregado correctamente";
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

limpiarForm();
if (arrayPaciente.length > 0) imprimirPacientes(); 
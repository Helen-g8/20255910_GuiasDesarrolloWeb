// Cada campo tiene su expresión regular, su mensaje y, opcionalmente,
// una validación extra que la regex sola no puede hacer
const fechaExiste = (texto) => {
  const [d, m, a] = texto.split("/").map(Number);
  const f = new Date(a, m - 1, d);
  return f.getFullYear() === a && f.getMonth() === m - 1 && f.getDate() === d;
};

const reglas = {
  idCarnet: {
    regex: /^[A-Za-z]{2}\d{3}$/,
    mensaje: "Debe tener 2 letras y 3 números. Ejemplo: AB001",
  },
  idNombreCompleto: {
    regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/,
    mensaje: "Ingrese nombre y apellido, solo letras (sin números ni símbolos)",
  },
  idDui: {
    regex: /^\d{8}-\d$/,
    mensaje: "Formato inválido. Ejemplo: 12345678-9",
  },
  idNit: {
    regex: /^\d{4}-\d{6}-\d{3}-\d$/,
    mensaje: "Formato inválido. Ejemplo: 1234-123456-123-1",
  },
  idFechaNac: {
    regex: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    extra: fechaExiste,
    mensaje: "Use el formato dd/mm/aaaa con una fecha real",
  },
  idCorreo: {
    regex: /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
    mensaje: "Correo inválido. Ejemplo: usuario@correo.com",
  },
  idEdad: {
    regex: /^\d{1,3}$/,
    extra: (texto) => Number(texto) >= 1 && Number(texto) <= 120,
    mensaje: "Solo números, entre 1 y 120",
  },
};

const campos = Object.keys(reglas).map((id) => document.getElementById(id));
const resultado = document.getElementById("idResultado");

// Valida un campo y le aplica el estilo de Bootstrap (verde o rojo)
const validarCampo = (input) => {
  const regla = reglas[input.id];
  const valor = input.value.trim();

  const esValido = regla.regex.test(valor) && (!regla.extra || regla.extra(valor));

  input.classList.toggle("is-valid", esValido);
  input.classList.toggle("is-invalid", !esValido);
  input.nextElementSibling.textContent = regla.mensaje;
  return esValido;
};

// Validación en tiempo real mientras el usuario escribe
campos.forEach((input) => {
  input.addEventListener("input", () => validarCampo(input));
});

// Validación completa al presionar el botón
document.getElementById("idBtnValidar").addEventListener("click", () => {
  // Se evalúan todos (sin cortar en el primer error) para marcar cada campo
  const resultados = campos.map((input) => validarCampo(input));
  const todoCorrecto = resultados.every((ok) => ok);

  resultado.className = todoCorrecto ? "mt-3 fw-bold text-success" : "mt-3 fw-bold text-danger";
  resultado.textContent = todoCorrecto
    ? "La ficha es válida. ¡Datos correctos!"
    : "Hay campos con errores, revise los marcados en rojo.";
});

document.getElementById("idBtnLimpiarFicha").addEventListener("click", () => {
  campos.forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid", "is-invalid");
  });
  resultado.textContent = "";
  campos[0].focus();
});
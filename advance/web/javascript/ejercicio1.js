document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    const texto = document.getElementById('texto').value.trim();
    const resultado = document.getElementById('resultado');

    // Condiciones: tener 5 caracteres Y un número, o estar vacío
    const tieneCincoCaracteres = texto.length >= 5;
    const contieneNumero = /\d/.test(texto); // Verifica si hay un número
    const estaVacio = texto === ""; // Verifica si está vacío

    if ((tieneCincoCaracteres && contieneNumero) || estaVacio) {
        resultado.innerHTML = `<span class="valido">El texto es válido.</span>`;
    } else {
        resultado.innerHTML = `<span class="invalido">El texto no es válido. Debe tener al menos 5 caracteres y contener un número, o estar vacío.</span>`;
    }
});

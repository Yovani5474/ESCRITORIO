
function len(texto) {
    let contador = 0;

    // Iteramos sobre cada carácter en la cadena
    for (let i = 0; i < texto.length; i++) {
        contador++;
    }

    return contador;
}

function contarCaracteres() {
    const texto = document.getElementById("texto").value;
    const cantidadCaracteres = len(texto);
    document.getElementById("resultado").innerText = `Cantidad de caracteres: ${cantidadCaracteres}`;
}
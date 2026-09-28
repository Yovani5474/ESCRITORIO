// Lógica para el bucle While
document.getElementById('btn-while').addEventListener('click', iniciarWhile);

function iniciarWhile() {
    var numero = parseInt(document.getElementById('numeroWhile').value);
    var resultado = '';

    if (isNaN(numero) || numero < 0) {
        resultado = 'Por favor, introduce un número válido.';
    } else {
        while (numero >= 0) {
            resultado += numero + ' ';
            numero--;
        }
    }

    document.getElementById('resultadoWhile').textContent = resultado;
}

// Lógica para el bucle Do...While
document.getElementById('btn-do-while').addEventListener('click', iniciarDoWhile);

function iniciarDoWhile() {
    var numero = parseInt(document.getElementById('numeroDoWhile').value);
    var resultado = '';

    if (isNaN(numero) || numero < 0) {
        resultado = 'Por favor, introduce un número válido.';
    } else {
        do {
            resultado += numero + ' ';
            numero--;
        } while (numero >= 0);
    }

    document.getElementById('resultadoDoWhile').textContent = resultado;
}

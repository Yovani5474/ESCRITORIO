document.getElementById('compararBtn').addEventListener('click', function() {
    // Obtener los valores de los inputs
    let num1 = parseFloat(document.getElementById('num1').value);
    let num2 = parseFloat(document.getElementById('num2').value);

    // Realizar operaciones de comparación
    let esIgual = num1 === num2;
    let esDistinto = num1 !== num2;
    let esMayor = num1 > num2;
    let esMenor = num1 < num2;
    let esMayorOIgual = num1 >= num2;
    let esMenorOIgual = num1 <= num2;

    // Mostrar los resultados
    let resultadosText = `
        <p>${num1} es igual a ${num2}: ${esIgual}</p>
        <p>${num1} es distinto de ${num2}: ${esDistinto}</p>
        <p>${num1} es mayor que ${num2}: ${esMayor}</p>
        <p>${num1} es menor que ${num2}: ${esMenor}</p>
        <p>${num1} es mayor o igual que ${num2}: ${esMayorOIgual}</p>
        <p>${num1} es menor o igual que ${num2}: ${esMenorOIgual}</p>
    `;
    document.getElementById('resultados').innerHTML = resultadosText;
});

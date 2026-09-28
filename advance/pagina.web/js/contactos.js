// Datos de los creadores
const creadores = [
    { nombre: "Raul A. Retamozo Paco", numero: "927407873" },
    { nombre: "Ramos Alanya, Abel Saul", numero: "948953966" }
];

// Selecciona el contenedor donde añadir la lista
const contenedor = document.getElementById('creadores');

// Recorre cada creador y crea un elemento para mostrarlo
creadores.forEach(creador => {
    // Crea un div para cada entrada
    const entrada = document.createElement('div');
    entrada.style.display = 'flex';
    entrada.style.alignItems = 'center';
    entrada.style.marginBottom = '10px';

    // Nombre del creador
    const nombre = document.createElement('span');
    nombre.textContent = creador.nombre;
    nombre.style.marginRight = '10px';

    // Ícono de WhatsApp
    const iconoWhatsApp = document.createElement('i');
    iconoWhatsApp.className = 'fab fa-whatsapp';
    iconoWhatsApp.style.color = '#25D366';
    iconoWhatsApp.style.marginRight = '10px';

    // Número de teléfono
    const numero = document.createElement('span');
    numero.textContent = creador.numero;

    // Agrega el nombre, ícono y número al div
    entrada.appendChild(nombre);
    entrada.appendChild(iconoWhatsApp);
    entrada.appendChild(numero);

    // Añade la entrada al contenedor
    contenedor.appendChild(entrada);
});
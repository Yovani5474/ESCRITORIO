document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !email || !mensaje) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }

    alert('Gracias por tu mensaje, ' + nombre + '!\nNos pondremos en contacto contigo pronto.');
    document.getElementById('contactForm').reset();
});

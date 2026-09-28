document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const responseMessage = document.getElementById('responseMessage');

    if (name && email) {
        responseMessage.textContent = `Gracias por suscribirte, ${name}. Pronto recibirás nuestras últimas ofertas en ${email}.`;
        responseMessage.style.color = 'green';
    } else {
        responseMessage.textContent = 'Por favor, complete todos los campos.';
        responseMessage.style.color = 'red';
    }
});

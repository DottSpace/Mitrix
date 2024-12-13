// Inizializza EmailJS con la tua Public Key
(function() {
    emailjs.init("-DRwAuk1F7r-cOyQ8"); // Sostituisci con la tua Public Key
})();

// Funzione per inviare l'email
function sendEmail() {
    // Raccogli i dati dal modulo
    const templateParams = {
        site_name: document.getElementById('site-name').value,  // Nome del sito
        site_url: document.getElementById('site-url').value,    // URL del sito
        site_description: document.getElementById('site-description').value,  // Descrizione del sito
        username: document.getElementById('username').value,    // Nome utente
        email: document.getElementById('email').value           // Email dell'utente
    };

    // Invia l'email tramite il Service ID e il Template ID
    emailjs.send('service_4rekc7l', 'template_nqbrifp', templateParams)
    .then(function(response) {
        // Se l'email è inviata con successo
        console.log('Successo:', response);
        alert('Email inviata con successo!');
    }, function(error) {
        // Se c'è un errore
        console.log('Errore:', error);
        alert('Errore nell\'invio dell\'email. Riprova!');
    });
}

// Aggiungi l'evento di invio del modulo
document.getElementById('register-site-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Previene l'invio normale del form
    sendEmail();  // Chiama la funzione di invio dell'email
});

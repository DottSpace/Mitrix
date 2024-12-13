document.addEventListener("DOMContentLoaded", function () {

  // Funzione per ottenere la nazione dell'utente tramite IP
  function getCountry() {
    fetch('https://ipinfo.io/json?token=d813d540a5ccd1') // Usa il tuo token da ipinfo.io
      .then(response => response.json())
      .then(data => {
        const country = data.country;
        document.getElementById('country').textContent = ` ${country}`;
      })
      .catch(error => {
        console.error("Errore nel recupero della nazione:", error);
        document.getElementById('country').textContent = "Impossibile rilevare la nazione";
      });
  }

  // Funzione per caricare i siti più cliccati
  function loadTopSites() {
    fetch('/get-top-sites')  // Endpoint per ottenere i siti più cliccati
      .then(response => response.json())
      .then(data => {
        const topSitesContainer = document.getElementById('top-sites');
        topSitesContainer.innerHTML = ''; // Pulisce il contenitore prima di caricare i nuovi siti

        data.forEach(site => {
          const siteElement = document.createElement('div');
          siteElement.classList.add('site');
          siteElement.innerHTML = `
            <a href="${site.url}" target="_blank" class="site-link" onclick="incrementClick('${site.url}')">
              ${site.name} - ${site.clicks} clicchi
            </a>
          `;
          topSitesContainer.appendChild(siteElement);
        });
      })
      .catch(error => {
        console.error('Errore nel caricamento dei siti più cliccati:', error);
      });
  }

  // Funzione per incrementare i click e aggiornare il database
  function incrementClick(siteUrl) {
    fetch('/increment-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: siteUrl })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Click incrementati con successo:', data);
    })
    .catch((error) => {
      console.error('Errore nell\'incrementare i click:', error);
    });
  }

  // Funzione per la ricerca
  const searchInput = document.getElementById('search-input');
  const searchButton = document.querySelector('.search-icon');
  const microphoneButton = document.getElementById('microphone');

  // Funzione per gestire il clic sul pulsante di ricerca
  searchButton.addEventListener("click", function () {
    const query = searchInput.value;
    if (query) {
      searchSites(query);
    }
  });

  // Funzione per gestire la pressione del tasto "Invio" nella barra di ricerca
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const query = searchInput.value;
      if (query) {
        searchSites(query);
      }
    }
  });

  // Funzione di ricerca nei siti del database
  function searchSites(query) {
    fetch('/search-sites', {  // Nuovo endpoint per cercare nei siti
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
      const searchResultsContainer = document.getElementById('search-results');
      searchResultsContainer.innerHTML = ''; // Pulisce i risultati precedenti

      data.forEach(site => {
        const siteElement = document.createElement('div');
        siteElement.classList.add('site');
        siteElement.innerHTML = `
          <a href="${site.url}" target="_blank" class="site-link" onclick="incrementClick('${site.url}')">
            ${site.name} - ${site.clicks} click
          </a>
        `;
        searchResultsContainer.appendChild(siteElement);
      });
    })
    .catch(error => {
      console.error('Errore nella ricerca dei siti:', error);
    });
  }

  // Funzione per usare la ricerca vocale
  microphoneButton.addEventListener("click", function () {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "it-IT";
      recognition.start();

      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchButton.click();
      };
    } else {
      alert("La funzione di riconoscimento vocale non è supportata dal tuo browser.");
    }
  });

  // Carica la nazione e i siti più cliccati all'inizio
  getCountry();
  loadTopSites();
});

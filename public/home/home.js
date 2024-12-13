document.addEventListener("DOMContentLoaded", function () {
  function loadTopSites() {
    fetch('/get-top-sites')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const topSitesContainer = document.getElementById('top-sites');
        topSitesContainer.innerHTML = ''; // Pulisce il contenitore

        // Controlla che l'array non sia vuoto
        if (data.length === 0) {
          topSitesContainer.innerHTML = '<p>Nessun sito disponibile</p>';
          return;
        }

        data.forEach(site => {
          const siteElement = document.createElement('div');
          siteElement.classList.add('site');
          siteElement.innerHTML = `
            <a href="${site.url}" target="_blank" class="site-link" 
               data-url="${site.url}" data-clicks="${site.clicks}">
              ${site.name} - <span class="clicks">${site.clicks}</span> click
            </a>
          `;
          siteElement.querySelector('.site-link').addEventListener('click', function (event) {
            event.preventDefault(); // Intercetta il clic
            const siteUrl = this.getAttribute('data-url');
            incrementClick(siteUrl, this);
          });
          topSitesContainer.appendChild(siteElement);
        });
      })
      .catch(error => {
        console.error('Errore nel caricamento dei siti più cliccati:', error);
        const topSitesContainer = document.getElementById('top-sites');
        topSitesContainer.innerHTML = '<p>Errore nel caricamento dei siti</p>';
      });
  }

  function incrementClick(siteUrl, element) {
    fetch('/increment-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: siteUrl }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Click incrementati con successo:', data);

        // Aggiorna il contatore visivamente
        const clicksElement = element.querySelector('.clicks');
        if (clicksElement) {
          const currentClicks = parseInt(clicksElement.textContent, 10);
          clicksElement.textContent = currentClicks + 1;
        }

        // Dopo aver incrementato il click, apri il sito
        window.open(siteUrl, '_blank'); // Apri in una nuova scheda
      })
      .catch(error => {
        console.error('Errore nell\'incrementare i click:', error);
        // Anche se c'è un errore, apri comunque il sito
        window.open(siteUrl, '_blank');
      });
  }
  document.getElementById('search-btn').addEventListener('click', function () {
    window.location.href = '../search/search.html';
  });
  document.getElementById('register-btn').addEventListener('click', function () {
    window.location.href = '../RegistraSito/RegSito.html';
  });
  
  // Carica i siti più cliccati all'inizio
  loadTopSites();
});

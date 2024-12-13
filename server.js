const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { Server } = require('socket.io'); // Importa il server di Socket.IO
const http = require('http'); // Per creare il server HTTP

const app = express();
const port = 80;

// Configura il server HTTP con Socket.IO
const server = http.createServer(app);
const io = new Server(server); // Passa il server HTTP a Socket.IO

const DATABASE_FILE = 'database.json';

// Funzione per caricare i dati dal file JSON
function loadDatabase() {
  if (!fs.existsSync(DATABASE_FILE)) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf8'));
}

// Funzione per salvare i dati nel file JSON
function saveDatabase(data) {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
}

app.use(bodyParser.json());
app.use(express.static('public'));

// Recupera i siti più cliccati
app.get('/get-top-sites', (req, res) => {
  const data = loadDatabase();
  const sortedSites = data.sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  res.json(sortedSites);
});

// Incrementa i clic per un sito specifico
app.post('/increment-click', (req, res) => {
  const { url } = req.body;
  const data = loadDatabase();
  const site = data.find(site => site.url === url);
  if (site) {
    site.clicks += 1;
    saveDatabase(data);
    io.emit('click-updated', { url, clicks: site.clicks }); // Notifica in tempo reale
    res.status(200).json({ message: 'Click incrementato' });
  } else {
    res.status(404).json({ error: 'Sito non trovato' });
  }
});

// Cerca siti
app.post('/search-sites', (req, res) => {
  const { query } = req.body;
  const data = loadDatabase();
  const results = data.filter(site => site.name.toLowerCase().includes(query.toLowerCase()));
  res.json(results);
});

// Servire i file HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home/home.html');
});

// Socket.IO - Gestione eventi
io.on('connection', (socket) => {
  console.log('Un utente si è connesso');

  socket.on('disconnect', () => {
    console.log('Un utente si è disconnesso');
  });
});

// Avvio del server
server.listen(port, () => {
  console.log(`Server in esecuzione su http://mitrix.giize.com/ su porta:${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5501;
const nivelesDir = path.join(__dirname, 'niveles');

if (!fs.existsSync(nivelesDir)) {
  fs.mkdirSync(nivelesDir, { recursive: true });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function sendSavedLevel(res) {
  const filePath = path.join(nivelesDir, 'nivel.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Saved level not found' });
      }
      console.error('Error reading saved level:', err);
      return res.status(500).json({ error: 'Error reading saved level', details: err.message });
    }

    try {
      const levelData = JSON.parse(data);
      res.json({ level: levelData, file: filePath });
    } catch (parseError) {
      console.error('Error parsing saved level JSON:', parseError);
      res.status(500).json({ error: 'Saved level is malformed', details: parseError.message });
    }
  });
}

app.post('/lvlm-script', (req, res) => {
  try {
    const levelData = req.body;
    console.log('Datos recibidos:', levelData);
    const filePath = path.join(nivelesDir, 'nivel.json');

    fs.writeFile(filePath, JSON.stringify(levelData, null, 2), (err) => {
      if (err) {
        console.error('Error writing level data to file:', err);
        return res.status(500).json({ error: 'Error saving level data', details: err.message });
      }
      console.log('Level data saved successfully to:', filePath);
      res.status(200).json({ message: 'Level data saved successfully', file: filePath });
    });
  } catch (error) {
    console.error('Error en POST /lvlm-script:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.get('/saved-level', (req, res) => sendSavedLevel(res));
app.get('/lvlm-script', (req, res) => sendSavedLevel(res));

app.get('/levels', (req, res) => {
  fs.readdir(nivelesDir, (err, files) => {
    if (err) {
      console.error('Error reading levels directory:', err);
      return res.status(500).json({ error: 'Error reading levels directory', details: err.message });
    }
    const levelFiles = files.filter(file => file.endsWith('.json'));
    res.json({ levels: levelFiles });
  });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Este archivo se ejecutara en nodejs
//sirve para exportar el nivel a un archivo JSON en el servidor para que el juego lo pueda leer
//El archivo a sido enviado por POST
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/lvlm-script', (req, res) => {
    const levelData = req.body.levelData;
    const filePath = path.join(__dirname, 'niveles', 'nivel.json');

    fs.writeFile(filePath, JSON.stringify(levelData), (err) => {
        if (err) {
            console.error('Error writing level data to file:', err);
            res.status(500).send('Error saving level data');
        } else {
            console.log('Level data saved successfully');
            res.status(200).send('Level data saved successfully');
        }
    });
});


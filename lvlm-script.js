var button = document.getElementById("generateLevel");
var levelLengthInput = document.getElementById("levelLength");
var levelTable = document.getElementById("levelTable");
var bodytable = document.getElementById("levelTableBody");
var length;
var bloques = [" ", "▲", "▴", "■"]
//ESTO es un EDITOR de nivees NO un generador de niveles, el generador de niveles es otro script que se ejecuta en el juego, este script solo genera la tabla para que el usuario pueda editarla y luego exportarla a un archivo JSON para que el juego lo pueda leer.
button.addEventListener("click", () => maketable());
var pincel = 0
var buttonchg = document.getElementById("nextpincl")
var curpin = document.getElementById("curpin")
var exptoserv = document.getElementById("exptoserv")


buttonchg.addEventListener("click", () => {
    pincel = (pincel + 1) % bloques.length
    curpin.textContent = "Pincel actual: " + bloques[pincel]

})
var exportButton = document.getElementById("exportLevel");
exportButton.addEventListener("click", () => {
    const levelData = [];
    for (let i = 0; i < bodytable.children.length; i++) {
        const row = bodytable.children[i];
        const rowData = [];
        for (let j = 0; j < row.children.length; j++) {
            const cell = row.children[j];
            switch (cell.textContent) {
                case " ":
                    rowData.push(0);
                    break;
                case "▲":
                    rowData.push(1);
                    break;
                case "▴":
                    rowData.push(2);
                    break;
                case "■":
                    rowData.push(3);
                    break;
                default:
                    rowData.push(0); // Default to 0 for unrecognized characters
            }
        }
        levelData.push(rowData);
    }
    const jsonLevelData = JSON.stringify(levelData);
    exportarNivel(levelData);
});

function maketable() {
    console.log("generando...")
    length = parseInt(levelLengthInput.value);
    if (length <= 0) {
        alert("Please enter a valid positive number for the level length.");
        return;
    }
    for (let index = 0; index < 4; index++) {
        const tr = document.createElement("tr");
        bodytable.appendChild(tr)
        console.log("fila creada")
        
    }
    for (let index = 0; index < bodytable.children.length; index++) {
        const element = bodytable.children[index];
        for (let j = 0; j < length; j++) {
            const td = document.createElement("td");
            td.textContent = " ";
            element.appendChild(td);
        }
        
    }

}

levelTable.addEventListener("click", function(event){
    const celda = event.target
    console.log(celda)
    if (celda.nodeName == "TD") {
        celda.textContent = bloques[pincel]
    }
})

function exportarNivel(levelData) {
    const contenido = JSON.stringify(levelData);
    
    // Crear un Blob con el contenido y el tipo MIME
    const blob = new Blob([contenido], { type: 'text/json' });
    
    // Crear un enlace temporal
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    
    // Configurar el enlace
    enlace.href = url;
    enlace.download = 'level.json'; // Nombre del archivo
    
    // Simular un clic para descargar
    enlace.click();
    
    // Liberar memoria
    URL.revokeObjectURL(url);
}

exptoserv.addEventListener("click", () => {
    const levelData = [];
    for (let i = 0; i < bodytable.children.length; i++) {
        const row = bodytable.children[i];
        const rowData = [];
        for (let j = 0; j < row.children.length; j++) {
            const cell = row.children[j];
            switch (cell.textContent) {
                case " ":
                    rowData.push(0);
                    break;
                case "▲":
                    rowData.push(1);
                    break;
                case "▴":
                    rowData.push(2);
                    break;
                case "■":
                    rowData.push(3);
                    break;
                default:
                    rowData.push(0); // Default to 0 for unrecognized characters
            }
        }
        levelData.push(rowData);
    }
    fetch('/lvlm-script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(levelData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Level exported to server successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error exporting level to server.');
    });
});






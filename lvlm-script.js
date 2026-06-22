var button = document.getElementById("generateLevel");
var levelLengthInput = document.getElementById("levelLength");
var levelTable = document.getElementById("levelTable");
var bodytable = document.getElementById("levelTableBody");
var length;

//ESTO es un EDITOR de nivees NO un generador de niveles, el generador de niveles es otro script que se ejecuta en el juego, este script solo genera la tabla para que el usuario pueda editarla y luego exportarla a un archivo JSON para que el juego lo pueda leer.
button.addEventListener("click", () => maketable());

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
            td.textContent = "0";
            element.appendChild(td);
        }
        
    }

}
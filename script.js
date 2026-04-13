var juego = document.getElementById("juego");
var body = document.body;
var cube = document.getElementById("Cube");
cube.addEventListener("click", function() {
    cube.style.bottom = "100px";
});
//Gravedad
while (true) {
    if (Intcube.style.bottom <= "0px") {
        cube.style.bottom = "0px";
    }
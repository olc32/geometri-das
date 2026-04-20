var juego = document.getElementById("juego");
var body = document.body;
var cube = document.getElementById("cube");
var gravity = -1;
var velocity = 0;
var y = 0;

cube.style.position = "absolute";
cube.style.bottom = "0px";
window.addEventListener("click", function() {
    velocity = 15;
});

function gameLoop() {
    velocity += gravity;
    y += velocity;
    cube.style.bottom = y + "px";
    if (parseInt(y) <= 0) {
        y = 0;
        velocity = 0;
    }
    console.log("Velocity: " + velocity + " | Bottom: " + cube.style.bottom + " | Y: " + y);
    requestAnimationFrame(gameLoop);
}

gameLoop();
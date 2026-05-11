var juego = document.getElementById("juego");
var body = document.body;
var cube = document.getElementById("cube");
var gravity = -1;
var velocity = 0;
var y = 0;
var lastime = 0;
var skipetime = 0.15;
var seconds = 0;
var nivel =  [[0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 1, 0, 1, 1, 0, 0, 1]];
var angulo = 0;
var pinchos = [];
var en_tierra = true;
var jumpspeed = 17;
var hitboxacurracity = 0.8;
var debuglogticks = false;
var debuglogbloques = false;
var bloqueidx = 0;
var bloquetipos = [0, 1]; // Tipos de bloques disponibles, actualmente aire y pinchos (1)
var capa = 0; // Capa del nivel que se usará para generar bloques (0-3)

const url = "lacanciondelsiglo.mp3";
const url2 = "laotracancion.mp3";
const music = new Audio(url2);
music.play();

cube.style.position = "absolute";
cube.style.bottom = "0px";
window.addEventListener("click", function() {
    if (en_tierra) {
    velocity = jumpspeed;
    en_tierra = false;
    }
});

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        if (en_tierra) {
        velocity = jumpspeed;
        en_tierra = false;
        }
    }
});

function gameLoop() {
    var deltaTime = (Date.now() - lastime) / 1000;
    lastime = Date.now();

    velocity += gravity;
    y += velocity;
    cube.style.bottom = y + "px";
    if (parseInt(y) <= 0) {
        y = 0;
        velocity = 0;
        en_tierra = true;
    }
    if (debuglogticks) {
        console.log("Velocity: " + velocity + " | Bottom: " + cube.style.bottom + " | Y: " + y + " | DeltaTime: " + deltaTime + " | Seconds: " + seconds);
    }
    requestAnimationFrame(gameLoop);
    //pinchos
    seconds += deltaTime;
    if (seconds >= skipetime) {
        seconds = 0;
        createBloque();
    }
   

}

gameLoop();

function createBloque() {
    if (!nivel[capa][bloqueidx] == 0) {
        if (debuglogbloques) {
        console.log("creando bloque");
        }
        var bloque = document.createElement("div");
        bloque.style.position = "fixed";
        var img = document.createElement("img");
        if (nivel[capa][bloqueidx] === 1) {
            img.src = "pincho.png";
            img.style.width = "50px";
        } else {
            //mas bloques en el futuro
        }
    if (debuglogbloques) {
        console.log("bloqueidx: " + bloqueidx + " | nivel[capa][bloqueidx]: " + nivel[capa][bloqueidx] + " | img.src: " + img.src);
    }
        img.style.width = "50px";
        bloque.appendChild(img);
        document.body.appendChild(bloque);
        bloque.style.right = "0px";
        bloque.style.bottom = "0px";
        pinchos.push(bloque);
        moverPincho(bloque);
        bloqueidx = (bloqueidx + 1) % nivel[0].length; // Avanza al siguiente bloque en el nivel, vuelve al inicio si llega al final
    }
    else {    
        if (debuglogbloques) {
        console.log("aire creado, no se hace nada" + " | bloqueidx: " + bloqueidx + " | nivel[capa][bloqueidx]: " + nivel[capa][bloqueidx]);    
        }
        bloqueidx = (bloqueidx + 1) % nivel[0].length; // Avanza al siguiente bloque en el nivel, vuelve al inicio si llega al final
       }
}

function moverPincho(pincho) {
    var right = parseInt(pincho.style.right);
    right += 5;
    pincho.style.right = right + "px";
    if (right < window.innerWidth) {
        requestAnimationFrame(function() {
            moverPincho(pincho);
        });
    } else {
        document.body.removeChild(pincho);
        pinchos.splice(pinchos.indexOf(pincho), 1);
    }
    if (checkCollision(cube, pincho)) {
        //alert("¡Has perdido!");
        cube.remove();
        location.href = "game-over.html";
    }
}


function rotarGradiente() {
    angulo = (angulo + 1) % 360; // Mantener entre 0 y 359
    body.style.background = `linear-gradient(${angulo}deg, red, blue)`;
    requestAnimationFrame(rotarGradiente); // Animación fluida
}

function checkCollision(cube, pincho) {
    var cubeRect = cube.getBoundingClientRect();
    var pinchoRect = pincho.getBoundingClientRect();
    return !(
        cubeRect.right < pinchoRect.left + (pinchoRect.width * (1 - hitboxacurracity)) ||
        cubeRect.left > pinchoRect.right - (pinchoRect.width * (1 - hitboxacurracity)) ||
        cubeRect.bottom < pinchoRect.top + (pinchoRect.height * (1 - hitboxacurracity)) ||
        cubeRect.top > pinchoRect.bottom - (pinchoRect.height * (1 - hitboxacurracity))
    );
}


function pararconsola() {
    debuglogticks = !debuglogticks;
    console.log("Debug log ticks: " + debuglogticks);
}
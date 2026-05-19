var juego = document.getElementById("juego");
var body = document.body;
var cube = document.getElementById("cube");
var gravity = -1;
var velocity = 0;
var y = 0;
var lastime = 0;
var skipetime = 0.11;
var seconds = 0;
var nivel =  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
var angulo = 0;
var pinchos = [];
var lastCollision = null;
var en_tierra = true;
var jumpspeed = 17;
var hitboxacurracity = 0.6;
var debuglogticks = false;
var debuglogbloques = false;
var bloqueidx2 = 0;
var lvlspeed = 7;




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
    
    if (getcolisiontype() !== null) {
        console.log(getcolisiontype().element.firstElementChild.src)
        
        if (getcolisiontype().element.firstElementChild.src === "https://ubiquitous-space-guide-r4wrjvx9q6jwfwqx7-5501.app.github.dev/Bloque.webp") {
            console.log('%c' + "colision con bloque, aterrizando", "color: green; font-size: 16px");
            en_tierra = true;
            velocity = 0;
            y = parseInt(getcolisiontype().element.style.bottom) + 50 + "px";
            
        }
        else {
            console.log('%c' + "colision con pincho o mitad, aplicando gravedad normal", "color: red; font-size: 16px");
            if (parseInt(y) <= 0) {
                
                 
           }
            else {
                en_tierra = false;
                
                velocity += gravity;
            }
        }
    }    
    
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
        createColunna();
    }
   

}

gameLoop();

function createColunna() {
    for (var i = 3; i >= 0; i--) {
        createBloque(i, bloqueidx2);
    }
    bloqueidx2 = (bloqueidx2 + 1) % nivel[0].length; // Avanza al siguiente bloque en el nivel, vuelve al inicio si llega al final
}

function createBloque(capa, bloqueidx) {
    if (nivel[capa][bloqueidx] !== 0) {
        if (debuglogbloques) {
        console.log("creando bloque");
        }
        var bloque = document.createElement("div");
        bloque.style.position = "fixed";
        var img = document.createElement("img");
        if (nivel[capa][bloqueidx] === 1) {
            img.src = "pincho.png";
            img.style.width = "50px";
        }else if (nivel[capa][bloqueidx] === 2) {
            img.src = "mitad.svg";
            img.style.width = "50px";
        }else if (nivel[capa][bloqueidx] === 3) {
            img.src = "Bloque.webp";
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
        bloque.style.bottom = (3 - capa) * 50 + "px"; // Ajusta la posición vertical según la capa
        pinchos.push(bloque);
        moverPincho(bloque);
        
    }
    else {    
        if (debuglogbloques) {
        console.log("aire creado, no se hace nada" + " | bloqueidx: " + bloqueidx + " | nivel[capa][bloqueidx]: " + nivel[capa][bloqueidx]);    
        }
        
       }
}






function moverPincho(pincho) {
    // Mover el pincho hacia la izquierda (aumenta right)
    var pinchotypeSrc = pincho.querySelector("img").src || "";
    var right = parseInt(pincho.style.right) || 0;
    right += lvlspeed;
    pincho.style.right = right + "px";
    if (right < window.innerWidth) {
        requestAnimationFrame(function() {
            moverPincho(pincho);
        });
    } else {
        if (document.body.contains(pincho)) document.body.removeChild(pincho);
        var idx = pinchos.indexOf(pincho);
        if (idx !== -1) pinchos.splice(idx, 1);
        return;
    }

    var collision = checkCollision(cube, pincho);

    if (collision.side !== "sin colisión") {
        var idx = pinchos.indexOf(pincho);
        lastCollision = {
            element: pincho,
            index: idx,
            collision: collision
        };
    }

    // Normalizamos el nombre del recurso para comparar fácilmente
    var pinchotype = "";
    if (pinchotypeSrc.indexOf("pincho.png") !== -1) pinchotype = "pincho";
    else if (pinchotypeSrc.indexOf("mitad.svg") !== -1) pinchotype = "mitad";
    else if (pinchotypeSrc.indexOf("Bloque.webp") !== -1 || pinchotypeSrc.indexOf("Bloque") !== -1) pinchotype = "bloque";

    // Lógica de colisiones solicitada:
    // - "pincho" y "mitad": matan por cualquier lado (si la hitbox acierta)
    // - "bloque": permiten aterrizar por arriba; matan sólo por frontal
    if (pinchotype === "pincho" || pinchotype === "mitad") {
        if (collision.hitboxAccuracy === true && collision.side !== "sin colisión") {
            matar();
        }
    } else if (pinchotype === "bloque") {
        if (collision.hitboxAccuracy === false) {
            if (collision.side === "frontal") {
            
                matar();
            }
            // colisiones por trasero o inferior no hacen nada
        }
    }
    
}

function matar() {
    /*
    cube.remove();
    location.href = "game-over.html";
    */
}


function rotarGradiente() {
    angulo = (angulo + 1) % 360; // Mantener entre 0 y 359
    body.style.background = `linear-gradient(${angulo}deg, red, blue)`;
    requestAnimationFrame(rotarGradiente); // Animación fluida
}

function checkCollision(cube, pincho) {
    var cubeRect = cube.getBoundingClientRect();
    var pinchoRect = pincho.getBoundingClientRect();
    var marginX = pinchoRect.width * (1 - hitboxacurracity) / 2;
    var marginY = pinchoRect.height * (1 - hitboxacurracity) / 2;

    var hitboxRect = {
        left: pinchoRect.left + marginX,
        right: pinchoRect.right - marginX,
        top: pinchoRect.top + marginY,
        bottom: pinchoRect.bottom - marginY
    };

    function rectsOverlap(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    function getCollisionSide(a, b) {
        var centerAX = (a.left + a.right) / 2;
        var centerAY = (a.top + a.bottom) / 2;
        var centerBX = (b.left + b.right) / 2;
        var centerBY = (b.top + b.bottom) / 2;
        var deltaX = centerAX - centerBX;
        var deltaY = centerAY - centerBY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX < 0 ? "frontal" : "trasero";
        }

        return deltaY < 0 ? "superior" : "inferior";
    }

    if (rectsOverlap(cubeRect, hitboxRect)) {
        return {
            side: getCollisionSide(cubeRect, pinchoRect),
            hitboxAccuracy: true
        };
    }

    if (rectsOverlap(cubeRect, pinchoRect)) {
        return {
            side: getCollisionSide(cubeRect, pinchoRect),
            hitboxAccuracy: false
        };
    }

    return {
        side: "sin colisión",
        hitboxAccuracy: false
    };
    
}


function pararconsola() {
    debuglogticks = !debuglogticks;
    debuglogbloques = !debuglogbloques;
    console.log("Debug log ticks: " + debuglogticks);
    console.log("Debug log bloques: " + debuglogbloques);
}

function getcolisiontype() {
    lastCollision = null;
    for (var i = 0; i < pinchos.length; i++) {
        var collision = checkCollision(cube, pinchos[i]);
        if (collision.side !== "sin colisión") {
            lastCollision = {
                element: pinchos[i],
                index: i,
                collision: collision
            };
            console.log("Colisión con pincho " + i + ": " + collision.side + " | Hitbox accuracy: " + collision.hitboxAccuracy);
            return lastCollision;
        }
    }
    return null;
}

function getultimaColision() {
    return lastCollision;
}

function getultimaColision() {
    return lastCollision;
}
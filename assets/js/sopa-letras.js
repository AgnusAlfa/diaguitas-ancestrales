// 1. NUESTRAS PALABRAS OBJETIVO
const palabrasObjetivo = ["ELQUI", "GREDA", "JARRO", "CHANGO"];
let palabrasEncontradas = 0;

// 2. EL TABLERO FIJO (Matriz de 8x8)
// Aquí escondimos las palabras horizontal y verticalmente.
const cuadricula = [
    ['E','L','Q','U','I','A','P','C'],
    ['X','M','Z','R','W','B','O','H'],
    ['J','A','R','R','O','C','T','A'],
    ['K','Y','L','S','D','G','Q','N'],
    ['G','R','E','D','A','U','V','G'],
    ['F','H','I','J','M','N','S','O'],
    ['A','B','C','D','E','Z','X','Y'],
    ['L','P','T','V','C','H','A','N'] // Nota: CHANGO está cortada a CHAN, la completaremos abajo para que calce bien en 8x8
];

// Corrección para que CHANGO quepa (es de 6 letras, la pondremos completa en la última fila)
cuadricula[7] = ['C','H','A','N','G','O','X','Y'];

// 3. VARIABLES DE ESTADO TEMPORAL
let seleccionActual = "";       // El texto de la palabra que estamos armando
let celdasSeleccionadas = [];   // Guardamos las casillas que el usuario tocó

// 4. ELEMENTOS DEL DOM
const tableroDiv = document.getElementById("tablero-sopa");
const textoPalabraActual = document.getElementById("palabra-actual");
const btnLimpiar = document.getElementById("btn-limpiar");
const mensajeVictoria = document.getElementById("mensaje-victoria-sopa");

// 5. FUNCIÓN PARA DIBUJAR EL TABLERO
function inicializarSopa() {
    // Recorremos las filas
    for (let fila = 0; fila < cuadricula.length; fila++) {
        // Recorremos las columnas de cada fila
        for (let col = 0; col < cuadricula[fila].length; col++) {
            const letra = cuadricula[fila][col];
            
            // Creamos un div para cada letra
            const divLetra = document.createElement("div");
            divLetra.textContent = letra;
            divLetra.classList.add("letra-sopa");
            
            // Le agregamos el evento de clic
            divLetra.addEventListener("click", () => tocarLetra(divLetra, letra));
            
            tableroDiv.appendChild(divLetra);
        }
    }
}

// 6. LÓGICA AL TOCAR UNA LETRA
function tocarLetra(elementoHtml, letra) {
    // Si la letra ya fue validada como correcta antes, no hacemos nada
    if (elementoHtml.classList.contains("encontrada")) return;

    // Si ya la habíamos tocado en este turno, la desmarcamos (se arrepintió)
    if (elementoHtml.classList.contains("seleccionada")) {
        elementoHtml.classList.remove("seleccionada");
        // Quitamos esta celda de nuestra lista temporal
        celdasSeleccionadas = celdasSeleccionadas.filter(celda => celda !== elementoHtml);
        actualizarTextoPantalla();
        return;
    }

    // Marcamos la letra
    elementoHtml.classList.add("seleccionada");
    celdasSeleccionadas.push(elementoHtml);
    actualizarTextoPantalla();
    verificarPalabra();
}

// 7. ACTUALIZAR EL TEXTO QUE VE EL USUARIO
function actualizarTextoPantalla() {
    seleccionActual = "";
    // Unimos las letras de todas las celdas seleccionadas
    celdasSeleccionadas.forEach(celda => {
        seleccionActual += celda.textContent;
    });
    
    // Mostramos la palabra en pantalla (o puntos si está vacía)
    textoPalabraActual.textContent = seleccionActual.length > 0 ? seleccionActual : "...";
}

// 8. VERIFICAR SI ENCONTRÓ UNA PALABRA
function verificarPalabra() {
    // Revisamos si la palabra que armó está en nuestra lista
    if (palabrasObjetivo.includes(seleccionActual)) {
        
        // ¡La encontró! Pintamos las celdas de verde
        celdasSeleccionadas.forEach(celda => {
            celda.classList.remove("seleccionada");
            celda.classList.add("encontrada");
        });

        // Tachamos la palabra en la lista de la derecha
        const elementoLista = document.getElementById("palabra-" + seleccionActual);
        if (elementoLista) {
            elementoLista.classList.add("tachada");
        }

        // Limpiamos la selección para que busque la siguiente
        celdasSeleccionadas = [];
        actualizarTextoPantalla();
        
        // Aumentamos el contador de victorias
        palabrasEncontradas++;
        if (palabrasEncontradas === palabrasObjetivo.length) {
            mensajeVictoria.classList.remove("d-none");
            textoPalabraActual.textContent = "¡Juego Completado!";
        }
    }
}

// 9. FUNCIÓN PARA EL BOTÓN "LIMPIAR"
function limpiarSeleccion() {
    celdasSeleccionadas.forEach(celda => {
        celda.classList.remove("seleccionada");
    });
    celdasSeleccionadas = [];
    actualizarTextoPantalla();
}

// Conectamos el botón
btnLimpiar.addEventListener("click", limpiarSeleccion);

// Arrancamos el juego
inicializarSopa();
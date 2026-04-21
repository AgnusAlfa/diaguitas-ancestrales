// 1. ESTADO DEL JUEGO
const ordenCorrecto = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // El objetivo a lograr
let ordenActual = []; // Cómo están las piezas ahora mismo
let piezaSeleccionada = null; // Guardará el número de la primera pieza que toquemos
let movimientos = 0;

// 2. ELEMENTOS DEL DOM
const tableroPuzzle = document.getElementById("tablero-puzzle");
const textoMovimientos = document.getElementById("movimientos-puzzle");
const btnMezclar = document.getElementById("btn-mezclar");
const mensajeExito = document.getElementById("mensaje-exito-puzzle");

// 3. INICIAR O REINICIAR EL JUEGO
function iniciarPuzzle() {
    movimientos = 0;
    textoMovimientos.textContent = movimientos;
    piezaSeleccionada = null;
    mensajeExito.classList.add("d-none");
    
    // Copiamos el orden correcto y lo desordenamos
    ordenActual = [...ordenCorrecto];
    // Algoritmo para desordenar
    ordenActual.sort(() => Math.random() - 0.5);

    dibujarTablero();
}

// 4. DIBUJAR LAS PIEZAS EN PANTALLA
function dibujarTablero() {
    tableroPuzzle.innerHTML = ""; // Vaciamos el tablero viejo

    // Recorremos nuestro arreglo desordenado y creamos los cuadritos
    ordenActual.forEach((numero, indice) => {
        const pieza = document.createElement("div");
        pieza.classList.add("pieza");
        pieza.textContent = numero;
        
        // Si el número coincide con su posición correcta, le damos un colorcito distinto
        if (numero === ordenCorrecto[indice]) {
            pieza.classList.add("correcta");
        }

        // Si esta es la pieza que el usuario ya seleccionó, la mantenemos marcada
        if (piezaSeleccionada === indice) {
            pieza.classList.add("seleccionada");
        }

        // Le enseñamos qué hacer al hacer clic
        pieza.addEventListener("click", () => tocarPieza(indice));
        
        tableroPuzzle.appendChild(pieza);
    });
}

// 5. LÓGICA DE INTERCAMBIO (SWAP)
function tocarPieza(indiceTocado) {
    // Si ya ganamos, no hacemos nada
    if (!mensajeExito.classList.contains("d-none")) return;

    if (piezaSeleccionada === null) {
        // CASO A: Es el primer clic. Solo seleccionamos la pieza.
        piezaSeleccionada = indiceTocado;
        dibujarTablero(); // Redibujamos para que se vea el borde rojo
    } else {
        // CASO B: Es el segundo clic. Intercambiamos posiciones.
        if (piezaSeleccionada === indiceTocado) {
            // Se arrepintió y tocó la misma pieza de nuevo
            piezaSeleccionada = null;
        } else {
            // Hacemos el intercambio de valores en nuestro arreglo
            let valorTemporal = ordenActual[piezaSeleccionada];
            ordenActual[piezaSeleccionada] = ordenActual[indiceTocado];
            ordenActual[indiceTocado] = valorTemporal;
            
            // Aumentamos movimientos y reseteamos la selección
            movimientos++;
            textoMovimientos.textContent = movimientos;
            piezaSeleccionada = null;
            
            verificarVictoria();
        }
        dibujarTablero(); // Redibujamos con las nuevas posiciones
    }
}

// 6. VERIFICAR SI GANÓ
function verificarVictoria() {
    // Comparamos si el arreglo actual es idéntico al arreglo correcto
    let gano = true;
    for (let i = 0; i < ordenCorrecto.length; i++) {
        if (ordenActual[i] !== ordenCorrecto[i]) {
            gano = false;
            break; // Si hay uno solo desordenado, dejamos de buscar
        }
    }

    if (gano) {
        mensajeExito.classList.remove("d-none");
    }
}

// 7. EVENTOS
btnMezclar.addEventListener("click", iniciarPuzzle);

// Arrancamos el juego al inicio
iniciarPuzzle();
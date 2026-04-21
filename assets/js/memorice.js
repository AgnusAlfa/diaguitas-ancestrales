// 1. NUESTRAS CARTAS (Usaremos iconos/emojis temporalmente como "Wireframes")
const iconos = ["🏺", "🐸", "☀️", "🦙", "⛰️", "💧"];

// 2. VARIABLES DE ESTADO (La "memoria" del juego)
let cartas = [];            // Aquí guardaremos las parejas mezcladas
let cartasVolteadas = [];   // Guarda las 2 cartas que estás mirando
let paresEncontrados = 0;   // Para saber cuándo ganas
let movimientos = 0;        // Para contar cuántos intentos haces
let bloqueado = false;      // Evita que el usuario haga clic a lo loco mientras se voltean las cartas

// 3. ELEMENTOS DEL DOM
const tablero = document.getElementById("tablero-memorice");
const contadorMovimientos = document.getElementById("contador-movimientos");
const mensajeVictoria = document.getElementById("mensaje-victoria");
const btnReiniciar = document.getElementById("btn-reiniciar");

// 4. FUNCIÓN PARA INICIAR O REINICIAR EL JUEGO
function iniciarJuego() {
    // Reiniciamos los contadores
    cartasVolteadas = [];
    paresEncontrados = 0;
    movimientos = 0;
    bloqueado = false;
    contadorMovimientos.textContent = movimientos;
    mensajeVictoria.classList.add("d-none");
    tablero.innerHTML = ""; // Limpiamos el tablero viejo

    // Duplicamos los iconos para hacer los pares (... es el operador spread, copia los elementos)
    cartas = [...iconos, ...iconos];
    
    // Mezclamos las cartas (Algoritmo de Fisher-Yates, un estándar de la industria)
    cartas.sort(() => Math.random() - 0.5);

    // Dibujamos las cartas en el HTML
    cartas.forEach((simbolo, index) => {
        crearCarta(simbolo, index);
    });
}

// 5. FUNCIÓN PARA CREAR CADA CARTA VISUALMENTE
function crearCarta(simbolo, index) {
    // Creamos la estructura HTML de la carta que definimos en el CSS
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("col-4", "col-md-3", "col-lg-2"); // Clases Bootstrap para la grilla

    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.indice = index; // Le ponemos una etiqueta secreta para identificarla

    // HTML interno de la carta (Adelante y atrás)
    carta.innerHTML = `
        <div class="carta-inner">
            <div class="carta-back">?</div>
            <div class="carta-front">${simbolo}</div>
        </div>
    `;

    // Le decimos qué hacer al hacerle clic
    carta.addEventListener("click", () => voltearCarta(carta, simbolo));
    
    cartaDiv.appendChild(carta);
    tablero.appendChild(cartaDiv);
}

// 6. LA LÓGICA DE VOLTEAR Y COMPARAR
function voltearCarta(carta, simbolo) {
    // Si el tablero está bloqueado, o si la carta ya está volteada, no hacemos nada
    if (bloqueado || carta.classList.contains("volteada")) return;

    // Volteamos visualmente la carta
    carta.classList.add("volteada");
    
    // La guardamos en nuestra memoria temporal
    cartasVolteadas.push({ cartaHtml: carta, valor: simbolo });

    // Si ya volteamos 2 cartas, toca comparar
    if (cartasVolteadas.length === 2) {
        movimientos++;
        contadorMovimientos.textContent = movimientos;
        verificarPar();
    }
}

// 7. VERIFICAR SI SON IGUALES
function verificarPar() {
    bloqueado = true; // Bloqueamos clics mientras revisamos

    const carta1 = cartasVolteadas[0];
    const carta2 = cartasVolteadas[1];

    if (carta1.valor === carta2.valor) {
        // ¡SON IGUALES!
        paresEncontrados++;
        cartasVolteadas = []; // Limpiamos la memoria
        bloqueado = false;    // Desbloqueamos el tablero

        // Verificamos si ganamos
        if (paresEncontrados === iconos.length) {
            mensajeVictoria.classList.remove("d-none");
        }
    } else {
        // NO SON IGUALES
        // Esperamos 1 segundo (1000 milisegundos) y las volvemos a esconder
        setTimeout(() => {
            carta1.cartaHtml.classList.remove("volteada");
            carta2.cartaHtml.classList.remove("volteada");
            cartasVolteadas = [];
            bloqueado = false;
        }, 1000);
    }
}

// 8. EVENTOS INICIALES
btnReiniciar.addEventListener("click", iniciarJuego);

// Arrancamos el juego apenas carga la página
iniciarJuego();

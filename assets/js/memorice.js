// CONFIGURACIÓN DE RUTAS E IMÁGENES
const rutaImg = "assets/icon/"; // RUTA CORREGIDA
const imagenesJuego = ["alfareria.png", "aros-metal.png", "familia.png", "jarro-pato.png", "llamas.png", "mazorca.png", "tejiendo.png", "zapallo.png"];
const imgReverso = "memorice.png";

// DICCIONARIO EDUCATIVO
const infoAncestral = {
    "alfareria.png": { titulo: "Alfarería", desc: "Consiste en el modelado manual de la greda extraída de los valles. Utilizaban la técnica del 'acordelado' superponiendo rollos de arcilla sin usar torno. Luego, pulían la pieza con piedras lisas y la horneaban a fuego directo para lograr una cerámica delgada y muy resistente." },
    "aros-metal.png": { titulo: "Aros de Metal", desc: "Mediante la fundición en crisoles y el martillado sobre piedra, los Diaguitas creaban láminas finas para confeccionar estos aros. Eran símbolos de prestigio que demostraban un avanzado dominio técnico y estatus social en los valles de la región" },
    "familia.png": { titulo: "Familia Diaguita", desc: "Se organizaban en familias extensas que habitaban pequeñas aldeas de piedra y barro. Su vida se basaba en la cooperación mutua para cultivar la tierra y cuidar el ganado, fortaleciendo linajes que unían a toda la comunidad con sus antepasados.." },
    "jarro-pato.png": { titulo: "Jarro Pato", desc: "Estas vasijas sagradas con forma de ave eran ofrendas exclusivas para ritos funerarios. Representaban una profunda conexión espiritual con la naturaleza y el agua, acompañando al difunto en su viaje al más allá." },
    "llamas.png": { titulo: "Llamas", desc: "Se utilizaban como animales de carga para las caravanas comerciales entre la costa y la cordillera, además de proveer lana, carne y cuero. Por su inmenso valor, eran consideradas sagradas y se representaban constantemente en petroglifos y cerámicas" },
    "mazorca.png": { titulo: "Mazorca", desc: "Base fundamental de su agricultura. Los Diaguitas lo cultivaban en los valles mediante avanzados canales de regadío. También lo utilizaban para elaborar chicha, una bebida fermentada indispensable en sus ritos y celebraciones." },
    "tejiendo.png": { titulo: "Arte Textil", desc: "Mediante telares verticales y lana de camélidos, confeccionaban su vestimenta diaria como ponchos y túnicas. Teñían los hilos con pigmentos naturales para tejer la misma iconografía geométrica de sus cerámicas, convirtiendo cada prenda en un lienzo que reflejaba su cosmovisión." },
    "zapallo.png": { titulo: "Zapallo y Porotos", desc: "Cultivado en los fértiles valles junto al maíz. El zapallo y los porotos eran un pilar fundamental de la alimentación diaguita. Destacaban por su alto valor nutricional y su capacidad de ser almacenado por largos periodos, asegurando el sustento de la aldea durante las épocas de escasez." }
};

// VARIABLES DE ESTADO
let cartas = [], cartasVolteadas = [], paresEncontrados = 0, movimientos = 0, bloqueado = false;
let segundos = 0, intervaloTiempo, timerIniciado = false;

// ELEMENTOS DEL DOM
const tablero = document.getElementById("tablero-memorice");
const contadorMovimientos = document.getElementById("contador-movimientos");
const contadorTiempo = document.getElementById("contador-tiempo");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Función para iniciar el juego
function iniciarJuego() {
    clearInterval(intervaloTiempo);
    segundos = 0;
    timerIniciado = false; 
    actualizarReloj();

    cartasVolteadas = [];
    paresEncontrados = 0;
    movimientos = 0;
    bloqueado = false;
    contadorMovimientos.textContent = movimientos;
    tablero.innerHTML = ""; 

    cartas = [...imagenesJuego, ...imagenesJuego];
    cartas.sort(() => Math.random() - 0.5);
    cartas.forEach((nombreImg, index) => crearCarta(nombreImg, index));
}

function crearCarta(nombreImg, index) {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("col-3", "animacion-entrada");
    cartaDiv.style.animationDelay = `${index * 0.05}s`;

    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.innerHTML = `
        <div class="carta-inner">
            <div class="carta-back"><img src="${rutaImg}${imgReverso}" class="reverso-img"></div>
            <div class="carta-front"><img src="${rutaImg}${nombreImg}" class="carta-img"></div>
        </div>`;

    carta.addEventListener("click", () => voltearCarta(carta, nombreImg));
    cartaDiv.appendChild(carta);
    tablero.appendChild(cartaDiv);
}

function voltearCarta(carta, nombreImg) {
    if (bloqueado || carta.classList.contains("volteada")) return;

    // EL CRONÓMETRO ARRANCA AQUÍ (CON EL PRIMER CLIC)
    if (!timerIniciado) {
        timerIniciado = true;
        intervaloTiempo = setInterval(() => { segundos++; actualizarReloj(); }, 1000);
    }

    carta.classList.add("volteada");
    cartasVolteadas.push({ html: carta, valor: nombreImg });

    if (cartasVolteadas.length === 2) {
        movimientos++;
        contadorMovimientos.textContent = movimientos;
        verificarPar();
    }
}

function verificarPar() {
    bloqueado = true;
    const [c1, c2] = cartasVolteadas;

    if (c1.valor === c2.valor) {
        paresEncontrados++;
        bloqueado = false;
        cartasVolteadas = [];
        
        // Mostrar ventana de información
        setTimeout(() => mostrarModal(c1.valor), 500);

        if (paresEncontrados === imagenesJuego.length) {
            clearInterval(intervaloTiempo);
        }
    } else {
        setTimeout(() => {
            c1.html.classList.remove("volteada");
            c2.html.classList.remove("volteada");
            cartasVolteadas = [];
            bloqueado = false;
        }, 1000);
    }
}

function mostrarModal(nombreImg) {
    const dato = infoAncestral[nombreImg];
    if (dato) {
        document.getElementById("info-titulo").textContent = dato.titulo;
        document.getElementById("info-descripcion").textContent = dato.desc;
        document.getElementById("info-img-container").innerHTML = `<img src="${rutaImg}${nombreImg}" style="width:100%; height:100%; object-fit:contain;">`;
        const modalElement = new bootstrap.Modal(document.getElementById('modalInfo'));
        modalElement.show();
    }
}

function actualizarReloj() {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    contadorTiempo.textContent = `${min}:${seg}`;
}

btnReiniciar.addEventListener("click", iniciarJuego);
document.addEventListener("DOMContentLoaded", iniciarJuego);

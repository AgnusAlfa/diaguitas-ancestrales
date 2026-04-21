// 1. NUESTRA BASE DE DATOS LOCAL (Un "Array" de "Objetos")
// Aquí guardamos las preguntas. Puedes agregar todas las que quieras después.
const bancoDePreguntas = [
    {
        pregunta: "¿Cuál era la principal actividad económica del pueblo Diaguita?",
        opciones: ["La pesca", "La agricultura y alfarería", "La minería de oro"],
        respuestaCorrecta: 1 // La posición correcta (Recuerda: en programación empezamos a contar desde 0, 1, 2)
    },
    {
        pregunta: "¿Cómo se llama la vasija más famosa de la cultura Diaguita?",
        opciones: ["Jarro Pato", "Cuenco de greda", "Ánfora alta"],
        respuestaCorrecta: 0
    },
    {
        pregunta: "¿En qué valles habitaron principalmente los Diaguitas en Chile?",
        opciones: ["Valle del Mapocho", "Valles de Elqui y Limarí", "Valle de Azapa"],
        respuestaCorrecta: 1
    }
];

// 2. VARIABLES DE ESTADO (Para recordar en qué parte del juego estamos)
let indicePreguntaActual = 0;
let puntajeAcumulado = 0;

// 3. SELECCIONAR ELEMENTOS DEL HTML (Conectar JS con HTML)
const textoPregunta = document.getElementById("texto-pregunta");
const contenedorOpciones = document.getElementById("contenedor-opciones");
const textoPuntaje = document.getElementById("puntaje");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const btnComenzar = document.getElementById("btn-comenzar");

// 4. FUNCIÓN PARA INICIAR EL JUEGO
function iniciarJuego() {
    indicePreguntaActual = 0;
    puntajeAcumulado = 0;
    textoPuntaje.textContent = puntajeAcumulado;
    mostrarPregunta();
}

// 5. FUNCIÓN PARA MOSTRAR UNA PREGUNTA
function mostrarPregunta() {
    // Escondemos el mensaje de feedback si estaba visible
    mensajeFeedback.classList.add("d-none"); 
    
    // Obtenemos la pregunta actual de nuestra base de datos
    const preguntaActual = bancoDePreguntas[indicePreguntaActual];
    
    // Cambiamos el texto en el HTML
    textoPregunta.textContent = preguntaActual.pregunta;

    // Vaciamos los botones anteriores
    contenedorOpciones.innerHTML = "";

    // Creamos un botón nuevo por cada opción de la pregunta
    preguntaActual.opciones.forEach((opcion, index) => {
        const boton = document.createElement("button");
        boton.textContent = opcion;
        boton.classList.add("btn", "btn-outline-secondary", "btn-lg"); // Clases de diseño de Bootstrap
        
        // Le decimos qué hacer cuando le hagan clic
        boton.addEventListener("click", () => verificarRespuesta(index, boton));
        
        contenedorOpciones.appendChild(boton);
    });
}

// 6. FUNCIÓN PARA VERIFICAR SI ACERTÓ
function verificarRespuesta(indiceElegido, botonPresionado) {
    const preguntaActual = bancoDePreguntas[indicePreguntaActual];
    
    // Desactivamos todos los botones para que no haga doble clic
    const botones = contenedorOpciones.querySelectorAll("button");
    botones.forEach(btn => btn.disabled = true);

    mensajeFeedback.classList.remove("d-none"); // Mostramos el feedback

    if (indiceElegido === preguntaActual.respuestaCorrecta) {
        // RESPUESTA CORRECTA
        botonPresionado.classList.replace("btn-outline-secondary", "btn-success");
        puntajeAcumulado += 10;
        textoPuntaje.textContent = puntajeAcumulado;
        mensajeFeedback.textContent = "¡Excelente! Respuesta correcta.";
        mensajeFeedback.className = "alert alert-success mt-3"; // Verde
    } else {
        // RESPUESTA INCORRECTA
        botonPresionado.classList.replace("btn-outline-secondary", "btn-danger");
        // Pintamos el correcto de verde para que aprenda
        botones[preguntaActual.respuestaCorrecta].classList.replace("btn-outline-secondary", "btn-success");
        mensajeFeedback.textContent = "Respuesta incorrecta. ¡Sigue intentando!";
        mensajeFeedback.className = "alert alert-danger mt-3"; // Rojo
    }

    // Esperar 2 segundos y pasar a la siguiente pregunta
    setTimeout(() => {
        indicePreguntaActual++;
        // Verificamos si quedan preguntas
        if (indicePreguntaActual < bancoDePreguntas.length) {
            mostrarPregunta();
        } else {
            terminarJuego();
        }
    }, 2000); // 2000 milisegundos = 2 segundos
}

// 7. FUNCIÓN PARA TERMINAR EL JUEGO
function terminarJuego() {
    textoPregunta.textContent = `¡Juego Terminado! Tu puntaje final es ${puntajeAcumulado} puntos.`;
    contenedorOpciones.innerHTML = ""; // Borramos los botones
    mensajeFeedback.classList.add("d-none"); // Ocultamos feedback

    // Creamos un botón para volver a jugar
    const btnReiniciar = document.createElement("button");
    btnReiniciar.textContent = "Volver a Jugar";
    btnReiniciar.classList.add("btn", "btn-diaguita", "btn-lg");
    btnReiniciar.addEventListener("click", iniciarJuego);
    contenedorOpciones.appendChild(btnReiniciar);
}

// 8. CONECTAR EL BOTÓN DE INICIO
btnComenzar.addEventListener("click", iniciarJuego);
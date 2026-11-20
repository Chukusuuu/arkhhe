let carrito = [];
let contenidoOriginalCatalogo = "";
const TELEFONO_WHATSAPP = "59172192875";
// Ruta de tu imagen QR
const IMAGEN_QR = "imagenes/qr-pago.jpg";

// Cargar la tienda
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".product-container");

    if (contenedor) {
        contenidoOriginalCatalogo = contenedor.innerHTML;
    }

    // Recuperar carrito guardado
    try {
        carrito = JSON.parse(localStorage.getItem("arkhe_carrito")) || [];
    } catch (error) {
        carrito = [];
    }

    crearEstilos();
    crearBotonCarrito();
    actualizarContadorCarrito();
});
// ESTILOS DEL CARRITO Y VENTANAS
function crearEstilos() {
    if (document.getElementById("arkhe-estilos")) return;
    const estilos = document.createElement("style");
    estilos.id = "arkhe-estilos";

    estilos.textContent = `
        #cart-floating-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9998;
            background: #9b686b;
            color: white;
            border: none;
            border-radius: 30px;
            padding: 14px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,.25);
        }

        #cart-floating-btn:hover {
            background: #75494d;
        }

        #cart-badge-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 23px;
            height: 23px;
            margin-left: 6px;
            border-radius: 50%;
            background: #f3d5cf;
            color: #503638;
            font-size: 13px;
        }

        .arkhe-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(0,0,0,.72);
            align-items: center;
            justify-content: center;
            padding: 15px;
        }

        .arkhe-modal-content {
            position: relative;
            background: #fff8f5;
            color: #493638;
            width: 100%;
            max-width: 470px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0,0,0,.3);
        }

        .arkhe-modal-content h2,
        .arkhe-modal-content h3 {
            color: #9b686b;
            margin: 8px 0 15px;
        }

        .arkhe-cerrar {
            position: absolute;
            top: 8px;
            right: 15px;
            border: none;
            background: none;
            color: #75494d;
            font-size: 30px;
            cursor: pointer;
        }

        .arkhe-boton {
            display: inline-block;
            width: 100%;
            border: none;
            border-radius: 8px;
            padding: 12px 15px;
            margin-top: 10px;
            background: #9b686b;
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
        }

        .arkhe-boton:hover {
            opacity: .88;
        }

        .arkhe-secundario {
            background: #806d6d;
        }

        .arkhe-whatsapp {
            background: #25D366;
            color: white;
        }

        .arkhe-producto-carrito {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 12px 0;
            border-bottom: 1px solid #e5c9c5;
            text-align: left;
        }

        .arkhe-producto-carrito button {
            border: none;
            background: #ead2ce;
            color: #603f42;
            border-radius: 6px;
            padding: 6px 10px;
            cursor: pointer;
        }

        .arkhe-qr {
            display: block;
            width: 190px;
            max-width: 100%;
            height: auto;
            margin: 15px auto;
            border-radius: 8px;
        }

        .arkhe-total {
            font-size: 20px;
            font-weight: bold;
            color: #9b686b;
            margin: 18px 0;
        }

        .arkhe-detalle-imagen {
            width: 100%;
            max-width: 280px;
            max-height: 260px;
            object-fit: contain;
            border-radius: 10px;
            margin: 10px auto;
        }
    `;

    document.head.appendChild(estilos);
}

// ==========================================
// BOTÓN FLOTANTE DEL CARRITO
// ==========================================

function crearBotonCarrito() {
    if (document.getElementById("cart-floating-btn")) return;

    const boton = document.createElement("button");
    boton.id = "cart-floating-btn";
    boton.type = "button";
    boton.innerHTML = `
         Ver carrito
        <span id="cart-badge-count">0</span>
    `;

    boton.addEventListener("click", verCarritoModal);
    document.body.appendChild(boton);
}

// ==========================================
// VENTANA MODAL
// ==========================================

function obtenerModal() {
    let modal = document.getElementById("arkhe-modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "arkhe-modal";
        modal.className = "arkhe-modal";

        modal.addEventListener("click", function(evento) {
            if (evento.target === modal) {
                cerrarModal();
            }
        });

        document.body.appendChild(modal);
    }

    return modal;
}

function mostrarModal(contenido) {
    const modal = obtenerModal();

    modal.innerHTML = `
        <div class="arkhe-modal-content">
            <button class="arkhe-cerrar" type="button"
                    onclick="cerrarModal()">&times;</button>
            ${contenido}
        </div>
    `;

    modal.style.display = "flex";
}

function cerrarModal() {
    const modal = document.getElementById("arkhe-modal");
    if (modal) modal.style.display = "none";
}

// ==========================================
// VER DETALLES DEL PRODUCTO
// ==========================================

function verDetalle(nombre, precio, descripcion, imagen) {
    const contenedor = document.querySelector(".product-container");

    if (!contenedor) {
        console.error("No se encontró .product-container");
        return;
    }

    contenedor.innerHTML = `
        <div style="width:100%; text-align:center; padding:20px;">
            <img
                class="arkhe-detalle-imagen"
                src="${imagen}"
                alt="${nombre}"
                onerror="this.style.display='none'"
            >

            <h2>${nombre}</h2>

            <p style="font-size:22px; font-weight:bold; color:#9b686b;">
                ${precio}
            </p>

            <p style="margin:15px auto; max-width:600px; line-height:1.6;">
                ${descripcion}
            </p>

            <button type="button" class="arkhe-boton"
                onclick="agregarAlCarrito('${nombre}', '${precio}')">
                Agregar al carrito
            </button>

            <button type="button" class="arkhe-boton arkhe-secundario"
                onclick="volverAProductos()">
                ← Volver a productos
            </button>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function volverAProductos() {
    const contenedor = document.querySelector(".product-container");

    if (contenedor && contenidoOriginalCatalogo) {
        contenedor.innerHTML = contenidoOriginalCatalogo;
    }
}

// ==========================================
// AGREGAR PRODUCTOS AL CARRITO
// ==========================================

function agregarAlCarrito(nombre, precioTexto) {
    const precio = Number(
        String(precioTexto).replace(",", ".").replace(/[^\d.]/g, "")
    ) || 0;

    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precioTexto: precioTexto,
            precio: precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContadorCarrito();

    mostrarModal(`
        <h2>¡Producto agregado!</h2>
        <p><strong>${nombre}</strong> se agregó a tu carrito.</p>

        <button type="button" class="arkhe-boton"
            onclick="verCarritoModal()">
            Ver mi carrito
        </button>

        <button type="button" class="arkhe-boton arkhe-secundario"
            onclick="cerrarModal()">
            Seguir comprando
        </button>
    `);
}

function guardarCarrito() {
    localStorage.setItem("arkhe_carrito", JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("cart-badge-count");

    if (contador) {
        contador.textContent = carrito.reduce(
            (total, producto) => total + producto.cantidad, 0
        );
    }
}

// ==========================================
// TOTAL DEL CARRITO
// ==========================================

function obtenerTotalProductos() {
    return carrito.reduce(
        (total, producto) => total + producto.cantidad, 0
    );
}

function obtenerMontoTotal() {
    return carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad, 0
    );
}

// ==========================================
// MOSTRAR CARRITO, QR Y WHATSAPP
// ==========================================

function verCarritoModal() {
    if (carrito.length === 0) {
        mostrarModal(`
            <h2>Tu carrito está vacío</h2>
            <p>Agrega tus productos favoritos de ARKHE.</p>
            <button type="button" class="arkhe-boton"
                onclick="cerrarModal()">
                Seguir comprando
            </button>
        `);
        return;
    }

    const productosHTML = carrito.map((producto, indice) => `
        <div class="arkhe-producto-carrito">
            <div style="flex:1;">
                <strong>${producto.nombre}</strong><br>
                <small>
                    ${producto.cantidad} x ${producto.precioTexto}
                </small>
            </div>

            <strong>
                Bs. ${(producto.precio * producto.cantidad).toFixed(2)}
            </strong>

            <button type="button"
                onclick="eliminarDelCarrito(${indice})"
                title="Eliminar producto">
                ✕
            </button>
        </div>
    `).join("");

    const total = obtenerMontoTotal().toFixed(2);

    mostrarModal(`
        <h2> Mi carrito ARKHE</h2>

        <div>
            ${productosHTML}
        </div>

        <p class="arkhe-total">
            Total: Bs. ${total}
        </p>

        <h3>Realiza tu pago por QR</h3>

        <img
            src="${IMAGEN_QR}"
            alt="Código QR de pago ARKHE"
            class="arkhe-qr"
            onerror="this.style.display='none'; document.getElementById('qr-aviso').style.display='block';"
        >

        <p id="qr-aviso" style="display:none; color:#a33;">
            No se encontró la imagen QR. Revisa la ruta:
            ${IMAGEN_QR}
        </p>

        <p style="font-size:14px;">
            Después de realizar el pago, envíanos tu pedido por WhatsApp.
        </p>

        <button type="button"
            class="arkhe-boton arkhe-whatsapp"
            onclick="solicitarDeliveryWhatsApp()">
            Pedir por WhatsApp
        </button>

        <button type="button"
            class="arkhe-boton arkhe-secundario"
            onclick="cerrarModal()">
            Seguir comprando
        </button>
    `);
}

// ==========================================
// ELIMINAR PRODUCTOS
// ==========================================

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    actualizarContadorCarrito();
    verCarritoModal();
}

// ==========================================
// ENVIAR PEDIDO A WHATSAPP
// ==========================================

function solicitarDeliveryWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "¡Hola! Quiero realizar un pedido en ARKHE 💄\n\n";

    carrito.forEach(producto => {
        mensaje += `• ${producto.cantidad} x ${producto.nombre}`;
        mensaje += ` - ${producto.precioTexto}\n`;
    });

    mensaje += `\nTOTAL: Bs. ${obtenerMontoTotal().toFixed(2)}`;
    mensaje += "\n\nAdjunto mi comprobante de pago QR.";
    mensaje += "\nPor favor, quisiera coordinar mi pedido. ¡Gracias!";

    const enlace = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank" );
}
// ==========================================
// APARTADO: CUÉNTANOS TU EXPERIENCIA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    iniciarComentarios();
});

function iniciarComentarios() {
    const formulario = document.getElementById("form-experiencia");
    if (!formulario) return;

    renderizarComentarios();

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("exp-nombre").value.trim();
        const calificacion = document.getElementById("exp-calificacion").value;
        const comentario = document.getElementById("exp-comentario").value.trim();
        const estado = document.getElementById("mensaje-estado");

        if (!nombre || !comentario) return;

        // 1. Guardar localmente para mostrarlo en la página al instante
        const comentariosGuardados = JSON.parse(localStorage.getItem("arkhe_comentarios")) || [];
        comentariosGuardados.unshift({
            nombre,
            calificacion,
            comentario,
            fecha: new Date().toLocaleDateString("es-BO")
        });
        localStorage.setItem("arkhe_comentarios", JSON.stringify(comentariosGuardados));
        renderizarComentarios();

        // 2. Enviar a Formspree (si ya pusiste tu código) o por WhatsApp
        const urlAction = formulario.getAttribute("action");

        if (urlAction && !urlAction.includes("TU_CODIGO_AQUI")) {
            estado.textContent = "Enviando tu reseña...";
            try {
                const respuesta = await fetch(urlAction, {
                    method: "POST",
                    body: new FormData(formulario),
                    headers: { "Accept": "application/json" }
                });

                if (respuesta.ok) {
                    estado.textContent = "¡Gracias por compartir tu experiencia con ARKHE!";
                    formulario.reset();
                } else {
                    estado.textContent = "Tu reseña se publicó aquí, pero hubo un problema al enviarla al correo.";
                }
            } catch (error) {
                estado.textContent = "Reseña guardada en la página.";
            }
        } else {
            // Alternativa automática por WhatsApp si aún no configuras Formspree
            estado.textContent = "¡Gracias por tu comentario! Redirigiendo a WhatsApp...";
            const textoWA = `¡Hola ARKHE! Quiero dejar mi reseña \n\n*Nombre:* ${nombre}\n*Calificación:* ${calificacion}\n*Comentario:* ${comentario}`;
            window.open(`https://formspree.io/f/xqpqpvqe`, "_blank");
            formulario.reset();
        }
    });
}

function renderizarComentarios() {
    const contenedor = document.getElementById("lista-comentarios");
    if (!contenedor) return;

    const comentarios = JSON.parse(localStorage.getItem("arkhe_comentarios")) || [];

    if (comentarios.length === 0) {
        contenedor.innerHTML = "";
        return;
    }

    contenedor.innerHTML = comentarios.map(item => `
        <div class="comentario-item">
            <div class="comentario-cabecera">
                <span class="comentario-autor">${item.nombre}</span>
                <span class="comentario-estrellas">${item.calificacion}</span>
            </div>
            <p class="comentario-texto">${item.comentario}</p>
        </div>
    `).join("");
}
// ==========================================
// ANALIZADOR DE TIPO DE ROSTRO (ARKHE)
// ==========================================

let faceLandmarkerARKHE = null;

document.addEventListener("DOMContentLoaded", () => {
    iniciarAnalizadorRostro();
});

async function cargarModeloRostro() {
    if (faceLandmarkerARKHE) return faceLandmarkerARKHE;

    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs");
    const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    faceLandmarkerARKHE = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        runningMode: "IMAGE",
        numFaces: 1
    });

    return faceLandmarkerARKHE;
}

function iniciarAnalizadorRostro() {
    const inputFoto = document.getElementById("input-foto-rostro");
    const previewContenedor = document.getElementById("rostro-preview-contenedor");
    const imgPreview = document.getElementById("rostro-imagen-preview");
    const canvas = document.getElementById("rostro-canvas-puntos");
    const btnAnalizar = document.getElementById("btn-analizar-rostro");
    const cajaResultado = document.getElementById("rostro-resultado");

    if (!inputFoto || !btnAnalizar) return;

    inputFoto.addEventListener("change", (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (evento) => {
            imgPreview.src = evento.target.result;
            previewContenedor.style.display = "flex";
            cajaResultado.style.display = "none";

            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        lector.readAsDataURL(archivo);
    });

    btnAnalizar.addEventListener("click", async () => {
        if (!imgPreview.src) return;

        btnAnalizar.disabled = true;
        btnAnalizar.textContent = "Analizando proporciones...";
        cajaResultado.style.display = "none";

        try {
            const detector = await cargarModeloRostro();
            const resultados = detector.detect(imgPreview);

            if (!resultados.faceLandmarks || resultados.faceLandmarks.length === 0) {
                mostrarResultadoRostro(
                    "No detectamos un rostro claro",
                    "Intenta subir otra foto de frente, con buena luz y sin el cabello cubriendo los bordes del rostro.",
                    "Asegúrate de mirar directo a la cámara."
                );
                return;
            }

            const puntos = resultados.faceLandmarks[0];
            dibujarPuntosRostro(puntos, imgPreview, canvas);

            const diagnostico = calcularTipoRostro(puntos);
            mostrarResultadoRostro(diagnostico.tipo, diagnostico.descripcion, diagnostico.tip);

        } catch (error) {
            console.error("Error al analizar rostro:", error);
            mostrarResultadoRostro(
                "Error al procesar la imagen",
                "Verifica tu conexión a internet para cargar el detector facial e intenta nuevamente.",
                "Prueba con una imagen en formato JPG o PNG."
            );
        } finally {
            btnAnalizar.disabled = false;
            btnAnalizar.textContent = "✨ Analizar mi tipo de rostro";
        }
    });
}

function dibujarPuntosRostro(puntos, img, canvas) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Puntos clave: sien izq/der, pómulos izq/der, mandíbula izq/der, frente y mentón
    const indicesClave = [10, 152, 234, 454, 58, 288, 103, 332];

    ctx.fillStyle = "#9b686b";
    ctx.strokeStyle = "#F8EDEF";
    ctx.lineWidth = 2;

    indicesClave.forEach(idx => {
        const p = puntos[idx];
        const x = p.x * canvas.width;
        const y = p.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, canvas.width * 0.008), 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });
}

function distanciaPuntos(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function calcularTipoRostro(puntos) {
    const largoRostro = distanciaPuntos(puntos[10], puntos[152]);       // Frente superior a mentón
    const anchoFrente = distanciaPuntos(puntos[103], puntos[332]);      // Ancho de frente
    const anchoPomulos = distanciaPuntos(puntos[234], puntos[454]);     // Ancho de pómulos
    const anchoMandibula = distanciaPuntos(puntos[58], puntos[288]);    // Ancho de mandíbula

    const proporcionLargoAncho = largoRostro / anchoPomulos;
    const relacionMandibulaPomulos = anchoMandibula / anchoPomulos;
    const relacionFrenteMandibula = anchoFrente / anchoMandibula;

    if (proporcionLargoAncho > 1.38) {
        return {
            tipo: "Rostro Alargado / Rectangular",
            descripcion: "Tu rostro destaca por tener mayor longitud vertical que ancho, con líneas estilizadas desde la frente hasta el mentón.",
            tip: "Tip ARKHE: Aplica rubor de forma horizontal sobre las mejillas para equilibrar visualmente la longitud."
        };
    }

    if (relacionFrenteMandibula > 1.25 && anchoPomulos > anchoMandibula) {
        return {
            tipo: "Rostro Corazón / Diamante",
            descripcion: "Tus pómulos y frente son los protagonistas, afinándose delicadamente hacia un mentón definido.",
            tip: "Tip ARKHE: Ilumina el centro de la frente y el mentón, y difumina suavemente en las sienes para armonizar."
        };
    }

    if (proporcionLargoAncho <= 1.18 && relacionMandibulaPomulos >= 0.86) {
        return {
            tipo: "Rostro Cuadrado",
            descripcion: "Posees proporciones muy simétricas entre frente, pómulos y una línea mandibular definida y estructurada.",
            tip: "Tip ARKHE: Suaviza los ángulos aplicando rubor en movimientos circulares sobre el centro de las mejillas."
        };
    }

    if (proporcionLargoAncho <= 1.18 && relacionMandibulaPomulos < 0.86) {
        return {
            tipo: "Rostro Redondo",
            descripcion: "Tus facciones tienen curvas suaves y armónicas, donde el ancho de los pómulos y el largo del rostro son muy similares.",
            tip: "Tip ARKHE: Aplica contorno o rubor en diagonal ascendente hacia las sienes para estilizar y alargar el rostro."
        };
    }

    return {
        tipo: "Rostro Ovalado",
        descripcion: "Considerado el rostro más equilibrado en proporciones: los pómulos son ligeramente más anchos que la frente y la mandíbula se suaviza hacia el mentón.",
        tip: "Tip ARKHE: ¡Cualquier estilo de maquillaje te favorece! Resalta tus pómulos con un toque de iluminador."
    };
}

function mostrarResultadoRostro(titulo, descripcion, tip) {
    const cajaResultado = document.getElementById("rostro-resultado");
    cajaResultado.innerHTML = `
        <h3>${titulo}</h3>
        <p>${descripcion}</p>
        <div class="rostro-tip-arkhe">${tip}</div>
    `;
    cajaResultado.style.display = "block";
}
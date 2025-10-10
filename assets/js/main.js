document.addEventListener("DOMContentLoaded", () => {

// iniciación del carrito 
    let cart = []
    try {
        // recuperar el carrito guardado en el almacenamiento local
        const storedCart = localStorage.getItem("viveroCart")
        cart = storedCart ? JSON.parse(storedCart) : []
        console.log("[v0] Carrito cargado desde localStorage:", cart)
    } catch (error) {
        console.error("[v0] Error al cargar el carrito:", error)
        cart = []
    }

// menú hamburguesa toggle
    const toggle = document.getElementById("menu-toggle")
    const nav = document.getElementById("nav-center")
    if (toggle && nav) {
        // muestra u oculta el menú al hacer clic en el botón hamburguesa
        toggle.addEventListener("click", () => {
        nav.classList.toggle("show")
        })
    }

// submenú de producto en móviles
    const menuProductos = document.querySelector(".menu-productos > a")
    if (menuProductos) {
        menuProductos.addEventListener("click", (e) => {
            // solo activa en pantallas pequeñas (menor o igual a 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault()
                const parent = menuProductos.parentElement
                parent.classList.toggle("open")
            }
        })
    }

// filtrado de productos por categoría
const params = new URLSearchParams(window.location.search)
const categoria = params.get("categoria")
const productos = document.querySelectorAll(".producto-card")

// si hay una categoría en la URL, filtra los productos
if (categoria) {
    productos.forEach((card) => {
    if (categoria === "todos") {
        card.style.display = "block"
    } else {
        card.style.display = card.classList.contains(categoria) ? "block" : "none"
    }
    })
} else {
    // si no hay filtro, muestra todos los productos 
    productos.forEach((card) => {
    card.style.display = "block"
    })
}

// submenú para filtrar productos
document.querySelectorAll(".submenu a").forEach((link) => {
    link.addEventListener("click", (e) => {
        const filtro = link.getAttribute("data-filter")

        if (filtro) {
            e.preventDefault()
            const productos = document.querySelectorAll(".producto-card")

            productos.forEach((card) => {
            if (filtro === "todos") {
                card.style.display = "block"
            } else {
                card.style.display = card.classList.contains(filtro) ? "block" : "none"
            }
            })

            // cierra el menú móvil si estaba abierto
            const nav = document.getElementById("nav-center")
            if (nav && nav.classList.contains("show")) {
            nav.classList.remove("show")
            }
        }
    })
})

// modal de detalles de producto
const modal = document.getElementById("product-modal")
const modalClose = document.querySelector(".modal-close")
const productCards = document.querySelectorAll(".producto-card")

if (modal && modalClose) {
    productCards.forEach((card) => {
        // al clickear una tarjeta de producto se abre el modal con detalles
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-carrito")) {
                return
            }

            // obtiene datos del producto desde los artibutos
            const nombre = card.getAttribute("data-nombre")
            const precio = card.getAttribute("data-precio")
            const imagen = card.getAttribute("data-imagen")
            const descripcion = card.getAttribute("data-descripcion")
            const stock = card.getAttribute("data-stock")

            // rellena la información en el modal
            document.getElementById("modal-img").src = imagen
            document.getElementById("modal-nombre").textContent = nombre
            document.getElementById("modal-precio").textContent = `$${Number.parseInt(precio).toLocaleString("es-AR")}`
            document.getElementById("modal-descripcion").textContent = descripcion

            const stockDiv = document.getElementById("modal-stock")
            const addToCartBtn = document.getElementById("btn-add-to-cart")
            const quantityInput = document.getElementById("cantidad")

            // muestra si el producto tiene stock o no
            if (stock === "sin-stock") {
                stockDiv.innerHTML = '<span class="stock-badge sin-stock">Sin stock</span>'
                addToCartBtn.disabled = true
                addToCartBtn.textContent = "No disponible"
                quantityInput.disabled = true
                } else {
                    stockDiv.innerHTML = '<span class="stock-badge disponible">Disponible</span>'
                    addToCartBtn.disabled = false
                    addToCartBtn.textContent = "Agregar al carrito"
                    quantityInput.disabled = false
                }

                quantityInput.value = 1

                // guarda los datos en el botoón agregar al carrito 
                addToCartBtn.dataset.nombre = nombre
                addToCartBtn.dataset.precio = precio
                addToCartBtn.dataset.imagen = imagen

                // Show modal
                modal.style.display = "flex"
                document.body.style.overflow = "hidden"
            })
        })

        // cerrar modal
        modalClose.addEventListener("click", () => {
            modal.style.display = "none"
            document.body.style.overflow = "auto"
        })

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none"
                document.body.style.overflow = "auto"
            }
        })

        const btnDecrease = document.getElementById("btn-decrease")
        const btnIncrease = document.getElementById("btn-increase")
        const cantidadInput = document.getElementById("cantidad")

        if (btnDecrease && btnIncrease && cantidadInput) {
            btnDecrease.addEventListener("click", () => {
                const currentValue = Number.parseInt(cantidadInput.value)
                if (currentValue > 1) {
                    cantidadInput.value = currentValue - 1
                }
            })

            btnIncrease.addEventListener("click", () => {
                const currentValue = Number.parseInt(cantidadInput.value)
                const maxValue = Number.parseInt(cantidadInput.max)
                if (currentValue < maxValue) {
                cantidadInput.value = currentValue + 1
                }
            })
        }

        // agregar productos al carrito desde el modal
        const btnAddToCart = document.getElementById("btn-add-to-cart")
        if (btnAddToCart) {
            btnAddToCart.addEventListener("click", () => {
                const nombre = btnAddToCart.dataset.nombre
                const precio = Number.parseInt(btnAddToCart.dataset.precio)
                const imagen = btnAddToCart.dataset.imagen
                const cantidad = Number.parseInt(document.getElementById("cantidad").value)

                addToCart(nombre, precio, imagen, cantidad)

                modal.style.display = "none"
                document.body.style.overflow = "auto"

                alert(`${cantidad}x ${nombre} agregado al carrito`)
            })
        }
    }

// buscador, login, carrito lateral
const searchBtn = document.querySelector(".container-actions button:nth-child(1)")
const searchModal = document.getElementById("search-modal")
const searchClose = document.getElementById("search-close")
const searchInput = document.getElementById("search-input")
const searchResults = document.getElementById("search-results")

if (searchBtn && searchModal) {
    searchBtn.addEventListener("click", () => {
    searchModal.style.display = "flex"
    document.body.style.overflow = "hidden"
    searchInput.focus()
    })

    searchClose.addEventListener("click", () => {
    searchModal.style.display = "none"
    document.body.style.overflow = "auto"
    searchInput.value = ""
    searchResults.innerHTML = ""
    })

    searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
        searchModal.style.display = "none"
        document.body.style.overflow = "auto"
        searchInput.value = ""
        searchResults.innerHTML = ""
    }
    })

    searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim()

    if (query === "") {
        searchResults.innerHTML = ""
        return
    }

    const allProducts = document.querySelectorAll(".producto-card")
    const results = []

    allProducts.forEach((card) => {
        const nombre = card.getAttribute("data-nombre").toLowerCase()
        if (nombre.includes(query)) {
        results.push({
            nombre: card.getAttribute("data-nombre"),
            precio: card.getAttribute("data-precio"),
            imagen: card.getAttribute("data-imagen"),
            stock: card.getAttribute("data-stock"),
        })
        }
    })

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No se encontraron productos</div>'
    } else {
        searchResults.innerHTML = results
        .map(
            (product) => `
        <div class="search-result-item" data-nombre="${product.nombre}" data-precio="${product.precio}" data-imagen="${product.imagen}" data-stock="${product.stock}">
            <img src="${product.imagen}" alt="${product.nombre}">
            <div class="search-result-info">
            <h4>${product.nombre}</h4>
            <p>$${Number.parseInt(product.precio).toLocaleString("es-AR")}</p>
            </div>
        </div>
        `,
        )
        .join("")

        document.querySelectorAll(".search-result-item").forEach((item) => {
        item.addEventListener("click", () => {
            // Close search modal
            searchModal.style.display = "none"
            document.body.style.overflow = "auto"
            searchInput.value = ""
            searchResults.innerHTML = ""

            const nombre = item.getAttribute("data-nombre")
            const precio = item.getAttribute("data-precio")
            const imagen = item.getAttribute("data-imagen")
            const stock = item.getAttribute("data-stock")

            const productCard = Array.from(allProducts).find((card) => card.getAttribute("data-nombre") === nombre)
            const descripcion = productCard ? productCard.getAttribute("data-descripcion") : ""

            document.getElementById("modal-img").src = imagen
            document.getElementById("modal-nombre").textContent = nombre
            document.getElementById("modal-precio").textContent = `$${Number.parseInt(precio).toLocaleString("es-AR")}`
            document.getElementById("modal-descripcion").textContent = descripcion

            const stockDiv = document.getElementById("modal-stock")
            const addToCartBtn = document.getElementById("btn-add-to-cart")
            const quantityInput = document.getElementById("cantidad")

            if (stock === "sin-stock") {
            stockDiv.innerHTML = '<span class="stock-badge sin-stock">Sin stock</span>'
            addToCartBtn.disabled = true
            addToCartBtn.textContent = "No disponible"
            quantityInput.disabled = true
            } else {
            stockDiv.innerHTML = '<span class="stock-badge disponible">Disponible</span>'
            addToCartBtn.disabled = false
            addToCartBtn.textContent = "Agregar al carrito"
            quantityInput.disabled = false
            }

            quantityInput.value = 1
            addToCartBtn.dataset.nombre = nombre
            addToCartBtn.dataset.precio = precio
            addToCartBtn.dataset.imagen = imagen

            modal.style.display = "flex"
            document.body.style.overflow = "hidden"
        })
        })
    }
    })
}

const loginBtn = document.querySelector(".container-actions button:nth-child(2)")
const loginModal = document.getElementById("login-modal")
const loginClose = document.getElementById("login-close")
const loginForm = document.getElementById("login-form")

if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex"
    document.body.style.overflow = "hidden"
    })

    loginClose.addEventListener("click", () => {
    loginModal.style.display = "none"
    document.body.style.overflow = "auto"
    })

    loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = "none"
        document.body.style.overflow = "auto"
    }
    })

    loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (email && password) {
        alert(`Bienvenido! Has iniciado sesión con ${email}`)
        loginModal.style.display = "none"
        document.body.style.overflow = "auto"
        loginForm.reset()
    }
    })
}

const cartBtn = document.querySelector(".container-actions button:nth-child(3)")
const cartSidebar = document.getElementById("cart-sidebar")
const cartOverlay = document.getElementById("cart-overlay")
const cartClose = document.getElementById("cart-close")
const cartBody = document.getElementById("cart-body")
const cartFooter = document.getElementById("cart-footer")

function updateCartUI() {
    console.log("[v0] Actualizando interfaz del carrito:", cart)

    if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>'
    cartFooter.style.display = "none"
    } else {
    cartBody.innerHTML = cart
        .map((item, index) => {
        const nombre = item.nombre || "Producto sin nombre"
        const imagen = item.imagen || "/placeholder.svg"
        const precio = Number(item.precio) || 0
        const cantidad = Number(item.cantidad) || 1

        console.log("[v0] Rendering cart item:", { nombre, imagen, precio, cantidad })

        return `
            <div class="cart-item">
                <img src="${imagen}" alt="${nombre}" class="cart-item-image">
                <div class="cart-item-info">
                <div class="cart-item-name">${nombre}</div>
                <div class="cart-item-price">$${precio.toLocaleString("es-AR")}</div>
                <div class="cart-item-controls">
                    <button onclick="decreaseCartItem(${index})">-</button>
                    <span class="cart-item-quantity">${cantidad}</span>
                    <button onclick="increaseCartItem(${index})">+</button>
                </div>
                <span class="cart-item-remove" onclick="removeCartItem(${index})">Eliminar</span>
                </div>
            </div>
            `
        })
        .join("")

    // calcula el total del carrito
    const total = cart.reduce((sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 1), 0)
    document.getElementById("cart-total-price").textContent = `$${total.toLocaleString("es-AR")}`
    cartFooter.style.display = "block"
    }

    updateCartBadge()
}

// muestra la cantidad total de productos en el ícono del carrito
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)
    let badge = cartBtn.querySelector(".cart-badge")

    if (totalItems > 0) {
    if (!badge) {
        badge = document.createElement("span")
        badge.className = "cart-badge"
        cartBtn.style.position = "relative"
        cartBtn.appendChild(badge)
    }
    badge.textContent = totalItems
    } else {
    if (badge) {
        badge.remove()
    }
    }
}

// agregar productos al carrito
function addToCart(nombre, precio, imagen, cantidad) {
    console.log("[v0] Agregando producto al carrito:", { nombre, precio, imagen, cantidad })

    if (!nombre || !precio || !imagen) {
    console.error("[v0] Error: Datos del producto inválidos", { nombre, precio, imagen })
    alert("Error: Datos del producto inválidos")
    return
    }

    const existingItem = cart.find((item) => item.nombre === nombre)

    if (existingItem) {
    existingItem.cantidad += cantidad
    console.log("[v0] Updated existing item:", existingItem)
    } else {
    const newItem = {
        nombre: nombre,
        precio: Number(precio),
        imagen: imagen,
        cantidad: Number(cantidad),
    }
    cart.push(newItem)
    console.log("[v0] Nuevo producto añadido:", newItem)
    }

    localStorage.setItem("viveroCart", JSON.stringify(cart))
    console.log("[v0] Carrito guardado en almacenamiento local:", cart)
    updateCartUI()
}

// funciones globales para editar el carrito
window.increaseCartItem = (index) => {
    cart[index].cantidad++
    localStorage.setItem("viveroCart", JSON.stringify(cart))
    updateCartUI()
}

window.decreaseCartItem = (index) => {
    if (cart[index].cantidad > 1) {
    cart[index].cantidad--
    localStorage.setItem("viveroCart", JSON.stringify(cart))
    updateCartUI()
    }
}

window.removeCartItem = (index) => {
    cart.splice(index, 1)
    localStorage.setItem("viveroCart", JSON.stringify(cart))
    updateCartUI()
}

// abrir y cerrar carrito lateral
if (cartBtn && cartSidebar) {
    cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("open")
    cartOverlay.classList.add("show")
    document.body.style.overflow = "hidden"
    })

    cartClose.addEventListener("click", () => {
    cartSidebar.classList.remove("open")
    cartOverlay.classList.remove("show")
    document.body.style.overflow = "auto"
    })

    cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open")
    cartOverlay.classList.remove("show")
    document.body.style.overflow = "auto"
    })

    // simulacion redirigir a pagina de pago
    const checkoutBtn = document.querySelector(".btn-checkout")
    if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length > 0) {
        alert("Página de pago en construcción :)")
        }
    })
    }
}

// actualiza la interfaz al cargar
updateCartUI()
})

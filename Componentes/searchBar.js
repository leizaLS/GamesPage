import { db } from '../Componentes/fireBase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export function searchBar() {
    const element = document.getElementById("search-banner");

    const isInRoot = window.location.pathname.endsWith("index.html") || window.location == 'https://leizals.github.io/GamesPage/';
    const logoPath = isInRoot ? "./Componentes/logo.png" : "../Componentes/logo.png";

    let n = "";
    if (localStorage.getItem("cartList")) {
        let list = JSON.parse(localStorage.getItem("cartList")).length;
        if (list > 0) {
            n = list;
        }
    }

    element.innerHTML = `
        <div class="logo-container" onclick="window.location.href='${isInRoot ? './index.html' : '../index.html'}';">
            <img id="logo" src="${logoPath}" alt="Logo">
            <span class="site-name">GAMESTOCK</span>
        </div>
        <div class="search-container">
            <div class="input-with-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="search-input" placeholder="Buscar...">
            </div>
            <div class="search-results"></div>
        </div>
        <div class="bar-items">
            <button class="mobile-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>

            <button title="Iniciar sesión/Registro" id="account">
                <i class="fa-solid fa-user"></i>
            </button>

            <button title="Ver carrito" id="cart" onclick="window.location.href='${isInRoot ? './Cart/cart.html' : '../Cart/cart.html'}';">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="cart-count">${n}</span>
            </button>            
        </div>
    `;

    // Mostrar buscador en móvil
    const searchMobile = document.querySelector('.mobile-search');
    if (searchMobile) {
        searchMobile.addEventListener("click", () => {
            document.getElementById("search-banner").classList.toggle("active");
            document.querySelector(".search-container").classList.toggle("active");
        });
    }

    // Función de búsqueda en Firebase con token
    const input = document.getElementById("search-input");
    const resultsContainer = document.querySelector(".search-results");
    let currentSearchToken = 0;

    input.addEventListener("input", async () => {
        const searchText = input.value.toLowerCase().trim();
        const token = ++currentSearchToken;

        resultsContainer.innerHTML = ""; // Limpiar resultados anteriores

        if (searchText.length === 0) return;

        try {
            const querySnapshot = await getDocs(collection(db, "games"));

            if (token !== currentSearchToken) return; // Evitar resultados viejos

            const seenNames = new Set();
            let matches = [];

            querySnapshot.forEach(doc => {
                const game = doc.data();
                const nameLower = game.name.toLowerCase();
                if (nameLower.includes(searchText) && !seenNames.has(nameLower)) {
                    seenNames.add(nameLower);
                    matches.push(game);
                }
            });

            if (matches.length === 0) {
                const item = document.createElement("div");
                item.classList.add("search-result-item");
                item.innerHTML = `<span style="color: #ccc;">No se encontraron resultados</span>`;
                resultsContainer.appendChild(item);
                return;
            }

            matches.slice(0, 5).forEach(game => {
                const item = document.createElement("div");
                item.classList.add("search-result-item");
                item.innerHTML = ` 
                    <img src="${game.capsule_image}" alt="${game.name}" height="40">
                    <span>${game.name}</span>
                `;

                // Guardar ID y redirigir al detalle
                item.addEventListener("click", () => {
                    localStorage.setItem("selectedGameId", game.id);
                    window.location.href = isInRoot ? './DetalleProducto/detail.html' : '../DetalleProducto/detail.html';
                });
                resultsContainer.appendChild(item);
            });

        } catch (error) {
            if (token !== currentSearchToken) return;

            console.error("Error al buscar en Firebase:", error);
            const item = document.createElement("div");
            item.classList.add("search-result-item");
            item.innerHTML = `<span style="color: red;">Error al buscar</span>`;
            resultsContainer.appendChild(item);
        }
    });

    // Ocultar resultados al hacer clic fuera del buscador
    document.addEventListener("click", (event) => {
        const inputFocused = input.contains(event.target);
        const resultsFocused = resultsContainer.contains(event.target);

        if (!inputFocused && !resultsFocused) {
            resultsContainer.innerHTML = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const n = JSON.parse(localStorage.getItem("cartList")).length;
    if (n != 0) {
        document.querySelector("#cart-count").style.display = "unset";
    }
});

//Modal login/register
document.addEventListener("DOMContentLoaded", () => {
  const accountBtn = document.getElementById("account");

  accountBtn.addEventListener("click", () => {
    // Crea el HTML del modal
    const modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal">
        <span class="modal-close" id="modal-close">&times;</span>
        <div class="tabs">
          <div class="tab active" id="tab-login">Login</div>
          <div class="tab" id="tab-register">Registro</div>
        </div>
        <div class="tab-content" id="content-login">
          <input type="text" placeholder="Usuario">
          <input type="password" placeholder="Contraseña">
          <button>Entrar</button>
        </div>

        <div class="tab-content" id="content-register" style="display:none;">
          <input type="email" placeholder="Email">
          <input type="password" placeholder="Tu contraseña">
          <button>Registrarse</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos de cierre
    document.getElementById("modal-close").addEventListener("click", () => {
      modal.remove();
    });

    // Tabs de login / registro
    document.getElementById("tab-login").addEventListener("click", () => {
      document.getElementById("tab-login").classList.add("active");
      document.getElementById("tab-register").classList.remove("active");
      document.getElementById("content-login").style.display = "block";
      document.getElementById("content-register").style.display = "none";
    });

    document.getElementById("tab-register").addEventListener("click", () => {
      document.getElementById("tab-register").classList.add("active");
      document.getElementById("tab-login").classList.remove("active");
      document.getElementById("content-register").style.display = "block";
      document.getElementById("content-login").style.display = "none";
    });
  });
});

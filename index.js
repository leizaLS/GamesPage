import { db } from './Componentes/fireBase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { searchBar } from './Componentes/searchBar.js';
import { footer } from './Componentes/footer.js';

searchBar();
footer();

// Variables del DOM
const gamesContainer = document.querySelector(".products");
const paginationContainer = document.querySelector(".pagination-numbers");
const genresSelect = document.getElementById("genres-select");
const sortPriceSelect = document.getElementById("sort-price");
const releaseSelect = document.getElementById("release-select");
const showMenu = document.querySelector('.showMenu');

let PAGE_SIZE = 12;
let currentPage = 1;
let allGames = [];
let filteredGames = [];

// Fetch juegos desde Firebase
async function fetchAllGames() {
    try {
        const snapshot = await getDocs(collection(db, "games"));
        allGames = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            allGames.push(data);
        });

        console.log("Juegos obtenidos:", allGames);

        filteredGames = allGames;
        applyFilters();
    } catch (error) {
        console.error("Error cargando juegos:", error);
    }
}

// Renderiza una página específica
function renderPage(pageNumber) {
    currentPage = pageNumber;
    gamesContainer.innerHTML = "";
    const start = (pageNumber - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const gamesToShow = filteredGames.slice(start, end);

    gamesToShow.forEach(game => {
        const gameElement = document.createElement("div");
        gameElement.classList.add("product");
        gameElement.setAttribute("data-id", game.id);

        const priceValue = parseFloat(game.price.replace('$', '').trim());

        gameElement.innerHTML = `
            <img src="${game.capsule_image}" alt="${game.name}" class="game-image">
            <h4>${game.name}</h4>
            <p>$${priceValue.toFixed(2)}</p>
        `;
        gamesContainer.appendChild(gameElement);
    });
}

// Botones de paginación
function createPaginationButtons() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("pagination-button");
        if (i === currentPage) {
            btn.classList.add("active"); // Opción: marcar la actual
        }
        btn.addEventListener("click", () => renderPage(i));
        paginationContainer.appendChild(btn);
    }
}

// Aplica los filtros actuales
function applyFilters() {
    const selectedGenre = genresSelect.value;
    const sortOption = sortPriceSelect.value;
    const releaseOption = releaseSelect.value;

    filteredGames = allGames.filter(game => {
        const genreOk = selectedGenre === "All" || (game.genres && game.genres.includes(selectedGenre));
        return genreOk;
    });

    if (releaseOption === "new") {
        filteredGames.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    } else if (releaseOption === "old") {
        filteredGames.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    } else if (sortOption === "asc") {
        filteredGames.sort((a, b) => parseFloat(a.price.replace('$', '').trim()) - parseFloat(b.price.replace('$', '').trim()));
    } else if (sortOption === "desc") {
        filteredGames.sort((a, b) => parseFloat(b.price.replace('$', '').trim()) - parseFloat(a.price.replace('$', '').trim()));
    }

    const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);
    if (currentPage > totalPages) {
        currentPage = 1;
    }

    renderPage(currentPage);
    createPaginationButtons();
}

// Ajusta la cantidad de productos por página según el ancho
function updatePageSize() {
    const width = window.innerWidth;
    if (width >= 1830) {
        PAGE_SIZE = 28;
    } else if (width >= 1600) {
        PAGE_SIZE = 25;
    } else if (width >= 1440) {
        PAGE_SIZE = 20;
    } else {
        PAGE_SIZE = 12;
    }
    applyFilters();
}

// Listeners
window.addEventListener("resize", updatePageSize);
updatePageSize();

genresSelect.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
});

sortPriceSelect.addEventListener("change", () => {
    if (sortPriceSelect.value !== "none") {
        releaseSelect.value = "all";
    }
    currentPage = 1;
    applyFilters();
});

releaseSelect.addEventListener("change", () => {
    if (releaseSelect.value !== "all") {
        sortPriceSelect.value = "none";
    }
    currentPage = 1;
    applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
    fetchAllGames();
});

// Click para ir al detalle
gamesContainer.addEventListener("click", (event) => {
    let target = event.target;

    while (target && !target.classList.contains("product")) {
        target = target.parentElement;
    }

    if (target && target.classList.contains("product")) {
        const gameId = target.getAttribute("data-id");
        if (gameId) {
            localStorage.setItem("selectedGameId", gameId);
            window.location.href = './DetalleProducto/detail.html';
        }
    }
});

// Menú lateral para filtros en móviles
showMenu.addEventListener("click", () => {
    const menu = document.querySelector(".filters-menu");
    menu.classList.toggle("active");
});

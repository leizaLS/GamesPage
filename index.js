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

let PAGE_SIZE = 12  ; // Valor inicial
let allGames = [];
let filteredGames = [];

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

function renderPage(pageNumber) {
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

function createPaginationButtons() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("pagination-button");
        btn.addEventListener("click", () => renderPage(i));
        paginationContainer.appendChild(btn);
    }
}

function applyFilters() {
    const selectedGenre = genresSelect.value;
    const sortOption = sortPriceSelect.value;

    filteredGames = allGames.filter(game => {
        const genreOk = selectedGenre === "All" || (game.genres && game.genres.includes(selectedGenre));
        return genreOk;
    });

    if (sortOption === "asc") {
        filteredGames.sort((a, b) => parseFloat(a.price.replace('$', '').trim()) - parseFloat(b.price.replace('$', '').trim()));
    } else if (sortOption === "desc") {
        filteredGames.sort((a, b) => parseFloat(b.price.replace('$', '').trim()) - parseFloat(a.price.replace('$', '').trim()));
    }

    renderPage(1);
    createPaginationButtons();
}

function updatePageSize() {
    const width = window.innerWidth;
    if(width >= 1830) {
        PAGE_SIZE = 28;
    } else if (width >= 1600) {
        PAGE_SIZE = 25;
    } else if (width >= 1440) {
        PAGE_SIZE = 20;
    }
    applyFilters();
}

window.addEventListener("resize", updatePageSize);
updatePageSize();

genresSelect.addEventListener("change", applyFilters);
sortPriceSelect.addEventListener("change", applyFilters);

document.addEventListener("DOMContentLoaded", () => {
    fetchAllGames();
});

// Clicker
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

import { searchBar } from '../Componentes/searchBar.js';
import { db } from '../Componentes/fireBase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

searchBar();
getItems();

async function getItems() {
    const cartList = localStorage.getItem("cartList");

    if (cartList) {
        const elements = document.querySelector(".items");
        const list = JSON.parse(cartList);

        // Contar cantidades
        const quantityMap = {};
        list.forEach(id => {
            quantityMap[id] = (quantityMap[id] || 0) + 1;
        });

        // Obtener datos únicos de juegos desde Firebase
        const gamesData = await fetchGames(list);

        let items = '';
        let total = 0;

        gamesData.forEach((game) => {
            const quantity = quantityMap[String(game.id)] || 1;
            const unitPrice = parseFloat(game.price.replace('$', '')) || 0;
            const subtotal = unitPrice * quantity;
            total += subtotal;

            items += `
                <div class="item" data-id="${game.id}">
                    <img src="${game.capsule_image}" alt="${game.name}" />
                    <div class="item-details">
                        <h3>${game.name}</h3>
                        <p class="price">${game.price} x${quantity} = $${subtotal.toFixed(2)}</p>
                        <div class="qty-controls">
                            <button class="btn-decrease" data-id="${game.id}">–</button>
                            <span class="quantity">${quantity}</span>
                            <button class="btn-increase" data-id="${game.id}">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        elements.innerHTML = items;

        // Mostrar total
        const totalPriceElem = document.getElementById("total-price");
        if (totalPriceElem) {
            totalPriceElem.textContent = `$${total.toFixed(2)}`;
        }

        // Hacer visible contenedor
        document.querySelector(".container").style.visibility = "visible";

        // Añadir eventos a botones
        document.querySelectorAll(".btn-increase").forEach(button => {
            button.addEventListener("click", e => {
                const id = e.target.getAttribute("data-id");
                changeQuantity(id, +1);
            });
        });

        document.querySelectorAll(".btn-decrease").forEach(button => {
            button.addEventListener("click", e => {
                const id = e.target.getAttribute("data-id");
                changeQuantity(id, -1);
            });
        });

    } else {
        // Si no hay carrito, opcional: ocultar contenedor o mostrar mensaje
        document.querySelector(".container").style.visibility = "hidden";
    }
}

async function fetchGames(list) {
    const querySnapshot = await getDocs(collection(db, "games"));
    const uniqueIds = [...new Set(list)];
    const filteredGames = [];

    querySnapshot.forEach((doc) => {
        const game = doc.data();
        if (uniqueIds.includes(String(game.id))) {
            filteredGames.push(game);
        }
    });

    return filteredGames;
}

function changeQuantity(id, delta) {
    let cartList = JSON.parse(localStorage.getItem("cartList")) || [];

    if (delta > 0) {
        // Añadir unidad
        cartList.push(id);
    } else if (delta < 0) {
        // Quitar unidad (la primera que encuentre)
        const index = cartList.indexOf(id);
        if (index !== -1) {
            cartList.splice(index, 1);
        }
    }

    localStorage.setItem("cartList", JSON.stringify(cartList));
    getItems();
}

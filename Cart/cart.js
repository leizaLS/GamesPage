import { searchBar } from '../Componentes/searchBar.js';
import { db } from '../Componentes/fireBase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

searchBar();
getItems();

async function getItems() {
    const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
    const elements = document.querySelector(".items");
    const emptyMsg = elements.querySelector(".emptyMsg");
    const totalPriceElem = document.getElementById("total-price");

    if (cartList.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (emptyMsg) emptyMsg.style.display = "block";
        // Eliminar cualquier producto que quede
        elements.querySelectorAll(".item").forEach(el => el.remove());
        // Mostrar total en 0
        if (totalPriceElem) totalPriceElem.textContent = "$0.00";
        return;
    } else {
        // Ocultar mensaje cuando hay productos
        if (emptyMsg) emptyMsg.style.display = "none";
    }

    // Contar cantidades
    const quantityMap = {};
    cartList.forEach(id => {
        quantityMap[id] = (quantityMap[id] || 0) + 1;
    });

    // Obtener datos únicos de juegos desde Firebase
    const gamesData = await fetchGames(cartList);

    let itemsHTML = '';
    let total = 0;

    gamesData.forEach((game) => {
        const quantity = quantityMap[String(game.id)] || 1;
        const unitPrice = parseFloat(game.price.replace('$', '')) || 0;
        const subtotal = unitPrice * quantity;
        total += subtotal;

        itemsHTML += `
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

    // Actualizar productos en el DOM
    elements.querySelectorAll(".item").forEach(el => el.remove());
    elements.insertAdjacentHTML("beforeend", itemsHTML);

    // Actualizar total
    if (totalPriceElem) totalPriceElem.textContent = `$${total.toFixed(2)}`;

    // Agregar eventos a botones
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
        cartList.push(id);
    } else if (delta < 0) {
        const index = cartList.indexOf(id);
        if (index !== -1) {
            cartList.splice(index, 1);
        }
    }

    localStorage.setItem("cartList", JSON.stringify(cartList));
    getItems();
}


// Vaciar carrito
document.getElementById("btn-clear-cart").addEventListener("click", () => {
    localStorage.setItem("cartList", JSON.stringify([])); 
    getItems();
});

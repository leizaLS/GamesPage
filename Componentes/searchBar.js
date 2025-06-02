export function searchBar() {
    const element = document.getElementById("search-banner");
    element.innerHTML = `
        <div class="logo-container" onclick="window.location.href='../index.html';">
            <img id="logo" src="Componentes/logo.png" alt="Logo">
            <span class="site-name">GAMESTOCK</span>
        </div>
        <div class="search-container">
            <div class="input-with-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="search-input" placeholder="Buscar...">
            </div>
        </div>
        <div class="cart-container">
            <button id="cart">
                <span class="cart-text"></span>
                <i class="fa-solid fa-cart-shopping"></i>
            </button>
        </div>
    `;
}

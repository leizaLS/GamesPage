export function searchBar() {
    const element = document.getElementById("search-banner");

    const isInRoot = window.location.pathname.endsWith("index.html") || window.location == 'https://leizals.github.io/GamesPage/'
    const logoPath = isInRoot ? "./Componentes/logo.png" : "../Componentes/logo.png";

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
        </div>
        <div class="bar-items">
            <button class="mobile-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>

            <button title="Iniciar sesión" id="account">
                <i class="fa-solid fa-user"></i>
            </button>

            <button id="cart">
                <i class="fa-solid fa-cart-shopping"></i>
            </button>            
        </div>
    `;
}

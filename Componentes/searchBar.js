export function searchBar() {
    const element = document.getElementById("search-banner");

    const isInRoot = window.location.pathname.endsWith("index.html") || window.location == 'https://leizals.github.io/GamesPage/'
    const logoPath = isInRoot ? "./Componentes/logo.png" : "../Componentes/logo.png";

    let n = "";
    if (localStorage.getItem("cartList")){
        n = "(" + JSON.parse(localStorage.getItem("cartList")).length + ")";
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
        </div>
        <div class="bar-items">
            <button class="mobile-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>

            <button title="Iniciar sesión" id="account">
                <i class="fa-solid fa-user"></i>
            </button>

            <button id="cart" onclick="window.location.href='../Cart/cart.html'">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="cart-count">${n}</span>
            </button>            
        </div>
    `;

    //Mostrar buscador en móvil
    const searchMobile = document.querySelector('.mobile-search');

    if (searchMobile) {
        searchMobile.addEventListener("click", () => {
            document.getElementById("search-banner").classList.toggle("active");
            document.querySelector(".search-container").classList.toggle("active");
        });
    }
}
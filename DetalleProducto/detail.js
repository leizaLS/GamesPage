import { searchBar } from '../Componentes/searchBar.js';
searchBar();

const idJuego = localStorage.getItem('selectedGameId');

if (idJuego) {
    const timestamp = new Date().getTime();
    const url = `https://store.steampowered.com/api/appdetails?appids=${idJuego}&l=spanish&cc=US&t=${timestamp}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    console.log(proxyUrl)

    fetch(proxyUrl)
        .then(res => res.json())
        .then(data => {
            const gameData = data[idJuego];
            if (gameData && gameData.success) {
                const game = gameData.data;
                console.log(gameData.data);

                // Mostrar el nombre del juego
                const name = game.name;
                document.getElementById('game-name').textContent = name;

                // Mostrar el video
                const movies = game.movies;
                if (movies && movies.length > 0) {
                    const videoUrl = movies[0].mp4.max;
                    const videoElement = document.createElement('video');
                    videoElement.src = videoUrl;
                    videoElement.controls = true;
                    videoElement.width = 640;
                    videoElement.height = 360;
                    videoElement.style.display = 'block';
                    videoElement.style.marginTop = '20px';
                    videoElement.autoplay = true;
                    videoElement.muted = true;
                    document.getElementById('game-video').appendChild(videoElement);
                }
                
                //Mostrar precio
                if (game.price_overview.initial_formatted == "") {
                    document.getElementById('price').innerText = game.price_overview.final_formatted;
                }
                else {
                    document.getElementById('price').innerText = game.price_overview.initial_formatted;
                }

                // Mostrar la descripción detallada
                const description = game.detailed_description;
                document.getElementById('game-description').innerHTML = `<h3>Descripción:</h3><p>${description}</p>`;

                // Mostrar los idiomas soportados como lista
                const languages = game.supported_languages.split(', ');
                let languagesHTML = `<h3>Idiomas disponibles:</h3><ul>`;
                languages.forEach(language => {
                    languagesHTML += `<li>${language}</li>`;
                });
                languagesHTML += `</ul>`;
                document.getElementById('game-languages').innerHTML = languagesHTML;

                // Mostrar los requisitos
                const requirements = game.pc_requirements;
                let requirementsHTML = `<h3>Requisitos del sistema:</h3>`;
                requirementsHTML += `${requirements.minimum}`;
            
                if (requirements.recommended ) {
                    requirementsHTML += `${requirements.recommended}`;
                }

                document.getElementById('game-requirements').innerHTML = requirementsHTML;

                // Mostrar el desarrollador
                const developer = game.developers && game.developers.length > 0 ? game.developers[0] : 'Desarrollador no disponible';
                document.getElementById('game-developer').innerHTML = `<h3>Desarrollador:</h3><p>${developer}</p>`;

                // Mostrar los géneros como lista
                const genres = game.genres.map(genre => genre.description);
                let genresHTML = `<h3>Géneros:</h3><ul>`;
                genres.forEach(genre => {
                    genresHTML += `<li>${genre}</li>`;
                });
                genresHTML += `</ul>`;
                document.getElementById('game-genres').innerHTML = genresHTML;
                document.querySelector('.container').style.display = "unset";

            } else {
                document.getElementById('game-name').textContent = 'No se encontró información del juego.';
            }
        })
        .catch(error => {
            console.error('Error al obtener datos de Steam:', error);
            document.getElementById('game-name').textContent = 'Error al obtener información del juego.';
        });
    } 
    else {
    document.getElementById('game-name').textContent = 'No se encontró ID de juego en localStorage.';
}

// Carrito
const addItem = document.querySelector('.buy-button');

function cartItems(){
    // Aumentar valor del carrito en search bar
    const el = document.getElementById('cart-count');
    if (el.innerText == "") {
        el.innerText = "0"; 
    }
    const count = parseInt(el.innerText);
    el.innerText = `${count + 1}`;
    document.querySelector("#cart-count").style.display = "unset";
}

addItem.addEventListener("click", () => {  
    let list = JSON.parse(localStorage.getItem("cartList")); 
    let id = localStorage.getItem("selectedGameId");
    list.push(id); 

    localStorage.setItem("cartList", JSON.stringify(list)); 
    cartItems();
});


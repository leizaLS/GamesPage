export function footer() {
    const element = document.getElementById("footer");
    element.innerHTML = 
    `<div class="footer-content">
        <p>&copy; GameStock. Todos los derechos reservados.</p>
        <ul class="footer-links">
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Acerca de</a></li>
        <li><a href="#">Contacto</a></li>
        </ul>

        <div class="social-media">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
    </div>`;
}
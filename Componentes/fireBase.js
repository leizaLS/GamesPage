// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdmGUmgJy7TTBB9hjEGlSSM7Bz1z8CfwM",
    authDomain: "test-e24b2.firebaseapp.com",
    projectId: "test-e24b2",
    storageBucket: "test-e24b2.firebasestorage.app",
    messagingSenderId: "918076406670",
    appId: "1:918076406670:web:c824a65a8be755dfb542df",
    measurementId: "G-G46NW33GG1"
};

// Inicializar Firebase y exportar la base de datos
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

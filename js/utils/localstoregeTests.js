import { VARIABLE_CONNECTION } from "../config/config.js";

export function clearLocalStorage() {
    const btnLimparLocalstorege = document.getElementById('btn-clear-localstorege');
    btnLimparLocalstorege.addEventListener('click', () => {
        localStorage.clear();
        window.alert('LocalStorege resetado!');
    });
}

export function releaseLocalstorage() {
    const btnClearLocalStorege = document.getElementById("btn-clear-localstorege");
    const variable = VARIABLE_CONNECTION;
    if (variable === "local") {
        btnClearLocalStorege.style.display = "visible";
    } else {
        btnClearLocalStorege.style.display = "none";
    }
}

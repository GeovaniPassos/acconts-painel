import * as date from "../utils/date.js";
import { clearForm } from "./formUi.js";

export function bindModal() {
    openModal();
    closeModal();
}

function getModal() {
    return document.getElementById("modal");
}

// Função para o evento de abrir modal
export function openModal() {
    const modal = getModal();
    const dateInput = document.getElementById("date");
    const btnAbrir = document.getElementById("btn-open-form");
    if (btnAbrir){
        btnAbrir.addEventListener("click", () => {
            dateInput.value = date.formatDateCalendar(date.getTodayDate());
            modal.style.display = "block";
        });
    }
}

//Função para disparar o metodo de fechar o modal
export function closeModal() {
    const modal = getModal();
    const btnFechar = document.getElementById("btn-to-close");

    btnFechar.addEventListener("click", () => {
        clearAndCloseModal(modal);   
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            clearAndCloseModal(modal);
        }
    });

}

//Limpar e desabilitar a visualização do modal
function clearAndCloseModal(modal) {
    clearForm();
    modal.style.display = "none";
}
import { getDateParts } from "../utils/date";

const btnAbrir = document.getElementById("btn-open-form");
const btnFechar = document.getElementById("btn-to-close");
const modal = document.getElementById("modal");

// Evento para abrir modal
btnAbrir.addEventListener("click", () => {
    modal.style.display = "block";
    const dataAtual = getDateParts();
    dateInput.value = `${dataAtual.year}-${dataAtual.month}-${dataAtual.day}`;
});

// Evento para fechar modal
btnFechar.addEventListener("click", () => {
    clearForm();
    modal.style.display = "none";
});

// Evento para fechar ao clicar fora do modal
window.addEventListener("click", (event) => {
    if (event.target === modal) {
    clearForm();
    modal.style.display = "none";
    }
});
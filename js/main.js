import { findCategories } from "./ui/categoriesUi.js";

import { formatDate } from "./utils/date.js";

import { updateSummary } from "./ui/sumary.js";
import { showMessage, setLoading } from "./ui/feedback.js";
import { initExpenses } from "./controllers/expensesController.js";
import { bindModal } from "./ui/modal.js";
import { releaseLocalstorage } from "./utils/localstoregeTests.js";
import { definePayment } from "./controllers/paymentController.js";
import { initFlatpickr } from "./libs/flatpickr.js";
import { toggleStatusPayment } from "./ui/paymentUi.js";
import { bindFormSubmit } from "./ui/formUi.js";
import { bindExpensesListClick } from "./ui/expensesUi.js";

document.addEventListener("DOMContentLoaded", () => {
    initExpenses();
    bindModal();
    releaseLocalstorage();
    definePayment();
    initFlatpickr();
    toggleStatusPayment();
    bindFormSubmit();
    bindExpensesListClick();
});

// const input = document.getElementById('category-input');
// const listCategory = document.getElementById('ghost-text');

// input.addEventListener('input', () => {
    
//     const value = input.value;
    
//     if (!value) {
//         ghost.textContent = "";
//         return;
//     }

//     //função para verificar se existe com a letra

//     // Procura uma categoria ao digitar
//     const result = findCategories(value);

//     result.forEach(item => {
//         const li = document.createElement("li");
//         li.textContent = item;
//         li.onclick = () => {
//             input.value = item;
//             list.innerHtml = "";
//         }
//         list.appendChild(li);
//     });

//     // if (match) {
//     //     // O ghost text precisa ser o que o usuário digitou + o resto da palavra
//     //     // Usamos o valor do input original para manter a capitalização do usuário
//     //     ghost.textContent = value + match.slice(value.length);
//     // } else {
//     //     ghost.textContent = "";
//     // }
// });

// Evento para aceitar a sugestão com Tab ou Seta para Direita
// input.addEventListener('keydown', (e) => {
//     if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost.textContent) {
//         // Se houver uma sugestão, preenche o input e cancela o comportamento padrão
//         if (input.value.length < ghost.textContent.length) {
//             e.preventDefault();
//             input.value = ghost.textContent;
//             ghost.textContent = "";
//         }
//     }
// });

// ////////////////////////////
// const searchName = document.getElementById("searchName");
// const btnsearchName = document.getElementById("btn-searchName");

// // Evento para buscar a lista de depesas pelo nome
// btnsearchName.addEventListener('click', async () => {
//     const name = searchName.value;
//     expenseData = await service.getExpensesByName(name);
//     renderExpensesList(expenseData);
//     updateSummary(expenseData);
// });

// // Evento para aceitar o input de busca por nome com a tecla enter
// document.getElementById("searchName")
//     .addEventListener('keydown', function(UIEvent) {
//         if (UIEvent.key == 'Enter') {
//             document.getElementById("btn-searchName").click();
//         }
//     });

//     document.addEventListener("DOMContentLoaded", () => {
//     //refreshExpenses();
//     //document.getElementById("expenses-list").addEventListener("click", handleListClickPayment);
// });
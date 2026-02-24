import { VARIABLE_CONNECTION } from "./config/config.js";
import { findCategories } from "./ui/categoriesUi.js";

import { formatDate } from "./utils/date.js";

import { updateSummary } from "./ui/sumary.js";
import { showMessage, setLoading } from "./ui/feedback.js";
import { initExpenses } from "./controllers/expensesController.js";
<<<<<<< HEAD
import { bindModal } from "./ui/modal.js";
=======
import { bindPaymentToggleButtons } from "./ui/paymentUi.js";
import { initPayment } from "./controllers/paymentController.js";
>>>>>>> 68c21dc8f3d86092e2091730b3222fca1c91215e

document.addEventListener("DOMContentLoaded", () => {
    initExpenses();
<<<<<<< HEAD
    bindModal();
}

document.addEventListener("DOMContentLoaded", initApp);
=======
    initPayment();
});
>>>>>>> 68c21dc8f3d86092e2091730b3222fca1c91215e

// Função de inicialização do sistema, aonde vai carregar cada parte e adições de funções (Entender melhor essa parte)
// export function init() {
//     document.getElementById("expenses-form").addEventListener("submit", handleSaveExpenses);
//     document.getElementById("expenses-list").addEventListener("click", handleListClickPayment);
// }

// document.addEventListener("DOMContentLoaded", init);

// Botão para limpar localstorege, desabilitado emover quando for para produção (Falta melhorar em produção)
const btnLimparLocalstorege = document.getElementById('btn-clear-localstorege');
btnLimparLocalstorege.addEventListener('click', () => {
    localStorage.clear();
    window.alert('LocalStorege resetado!');
});

// Variáveis para guardar a lista de depesas
let expenseData = [];

const btnClearLocalStorege = document.getElementById("btn-clear-localstorege");
const variable = VARIABLE_CONNECTION;
if (variable === "local") {
    btnClearLocalStorege.style.display = "visible";
} else {
    btnClearLocalStorege.style.display = "none";
}
//refreshExpenses();

//renderExpenseListForMouth();
// Função para recarregar a lista de despesas
// async function refreshExpenses() {
//     try {
//         setLoading(true);
        
//         expenseData = await service.getExpensesByMonth(getYearFromTheCurrentPeriod(), getMonthFromTheCurrentPeriod());
//         renderExpensesList(expenseData);
//         updateSummary(expenseData);
//     } catch (e) {
//         showMessage("error", `Falha ao carregar: ${e.message}`);
//     } finally {
//         setLoading(false);
//     }
// }

// Função para lidar com o salvamento da despesa
async function handleSaveExpenses(event) {
    event.preventDefault();
    const form = event.target;
    const categoryTyped = document.getElementById('category-input').value.trim();
    const paymentForm = document.querySelector(".btn-form-status").dataset.paid;
    let paymentDate = document.querySelector(".expense-payment-date").value;
    paymentDate = paymentForm == "true" ? paymentDate : "";
    const data = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        categoryName: categoryTyped,
        installment: 1,
        totalInstallments: Number(form.installments.value),
        value: Number(form.value.value),
        payment: paymentForm,
        paymentDate: formatDateApi(paymentDate),
        date: form.date.value
    };

    if (!data.name || isNaN(data.value || !data.categoryName)) {
        showMessage("error", "Preencha o nome, valor e categoria pelo menos.");
        return;
    }
    try {
        setLoading(true);
        
        const categoryExists = categories.some(cat => cat.toLowerCase() === categoryTyped.toLowerCase());
        if (!categoryExists) {
            try {
                const categoryCreate = {
                    name: categoryTyped,
                    type: "EXPENSES"
                };
                
                const newCategory = await service.createCategory(categoryCreate);

                categories.push(newCategory.name);
                if (typeof categoriesData != 'undefined') {
                    categoriesData.push(newCategory);
                }

            } catch (e) {
                showMessage("error", `Erro ao criar a categoria!`);
            }
        
        }

        if (form.dataset.mode === "edit" && form.dataset.id) {
            expenseData = await service.updateExpenses(form.dataset.id, data);
            showMessage("success", "Conta atualizada.");
        } else {
            //expenseData = await service.addInstallments(data); //Implementar a separação de função no futuro
            expenseData = await service.createExpenses(data);
            showMessage("success", "Conta criada.");
        }

        // Limpa o formulario
        form.reset();
        document.getElementById('ghost-text').textContent = "";

        //Reset do botão de status
        clearForm();

        // Limpa o campo de data de pagamento
        document.querySelector(".expense-payment-date").value = "";
        
        // fecha o modal e atualiza a lista de despesas
        modal.style.display = "none";
    } catch (e) {
        showMessage("error", `Erro: ${e.message}`);
    } finally {
        refreshExpenses();
        setLoading(false);
    }
    
}
 
// Função para lidar com o clique no pagamento da despesa
async function handleListClickPayment(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);
    const element = document.querySelector(`.expense-payment-date-${id}`);
    const badge = event.target.closest(".badge");
    if(badge) {
        const expense = expenseData.find(e => e.id === id);
        if (expense) {
            try {
                const expense = await service.togglePayment(id);
                
                toggleStatusVisual(badge, expense.payment);
                if (expense.payment) {
                    element.innerHTML = `${formatDate(expense.paymentDate)}`
                } else {
                    element.innerHTML = ``
                }

                updateSummary(expenseData);
                
                showMessage("success", "Status atualizado!");
            } catch (e) {
                showMessage("error", "Erro ao mudar status.");
            }
        }
        return;
    }   

    const btnDelete = event.target.closest(".btn-delete");
    if (btnDelete) {
        if (!confirm("Excluir está conta?")) return;
        try {
            setLoading(true);
            await service.deleteExpenses(id);
            showMessage("success", "Conta excluída.");
        } catch (e) {
            showMessage("error", `Erro ao excluir: ${e.message}`);
        } finally {
            refreshExpenses();
            setLoading(false);
        }
    }

    const btnEdit = event.target.closest(".btn-edit");
    if (btnEdit) {
        try {
            setLoading(true);
            const expenses = await service.getExpensesById(id);
            fillFormForEdit(expenses);
        } catch (e) {
            showMessage("error", `Error ao buscar a despesa: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }
}



// Variáveis relacionadas ao modal
// const btnAbrir = document.getElementById("btn-open-form");
// const btnFechar = document.getElementById("btn-to-close");
// const modal = document.getElementById("modal");
// const dateInput = document.getElementById("date");

// // Evento para abrir modal
// btnAbrir.addEventListener("click", () => {
//     modal.style.display = "block";
//     //const dataAtual = getDateParts();
//     dateInput.value = `${dataAtual.year}-${dataAtual.month}-${dataAtual.day}`;
// });

// // Evento para fechar modal
// btnFechar.addEventListener("click", () => {
//     clearForm();
//     modal.style.display = "none";
// });

// // Evento para fechar ao clicar fora do modal
// window.addEventListener("click", (event) => {
//   if (event.target === modal) {
//     clearForm();
//     modal.style.display = "none";
//   }
// });

// Váriaveis para sugestão da categoria no formulário
//const categoriesData = getCategoriesNames();   //deletar
//const categories = categoriesData.map(cat => cat.name);

const input = document.getElementById('category-input');
const ghost = document.getElementById('ghost-text');

input.addEventListener('input', () => {
    
    const value = input.value;
    
    if (!value) {
        ghost.textContent = "";
        return;
    }

    //função para verificar se existe com a letra

    // Procura uma categoria ao digitar
    findCategories(value);

    // if (match) {
    //     // O ghost text precisa ser o que o usuário digitou + o resto da palavra
    //     // Usamos o valor do input original para manter a capitalização do usuário
    //     ghost.textContent = value + match.slice(value.length);
    // } else {
    //     ghost.textContent = "";
    // }
});

// Evento para aceitar a sugestão com Tab ou Seta para Direita
input.addEventListener('keydown', (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost.textContent) {
        // Se houver uma sugestão, preenche o input e cancela o comportamento padrão
        if (input.value.length < ghost.textContent.length) {
            e.preventDefault();
            input.value = ghost.textContent;
            ghost.textContent = "";
        }
    }
});

// const btnTableStatus = document.querySelectorAll(".btn-table-status");

// // Evento para alterar status do botão de pagamento
// btnTableStatus.forEach(btn => {
//     btn.addEventListener("click", () => {
//         const isPaid = btn.dataset.paid === "true";
//         toggleStatusVisual(btn, !isPaid);
//     });
// });

const statusbtnForm = document.querySelector(".btn-form-status");
const paymentDateForm = document.querySelector(".expense-payment-date");
// Evento para alterar o status dentro do formulário
statusbtnForm.addEventListener("click", () => {
    const isPaid = statusbtnForm.dataset.paid === "true";
    toggleStatusVisual(statusbtnForm, !isPaid);
    paymentDateForm.value = !isPaid ? getTodayDate() : "";
});

const searchName = document.getElementById("searchName");
const btnsearchName = document.getElementById("btn-searchName");

// Evento para buscar a lista de depesas pelo nome
btnsearchName.addEventListener('click', async () => {
    const name = searchName.value;
    expenseData = await service.getExpensesByName(name);
    renderExpensesList(expenseData);
    updateSummary(expenseData);
});

// Evento para aceitar o input de busca por nome com a tecla enter
document.getElementById("searchName")
    .addEventListener('keydown', function(UIEvent) {
        if (UIEvent.key == 'Enter') {
            document.getElementById("btn-searchName").click();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
    //refreshExpenses();
    //document.getElementById("expenses-list").addEventListener("click", handleListClickPayment);
});

initFlatpickr();

// Função para acionar o Flatpickr (Calendário personalizado)
function initFlatpickr() {
    const element = document.getElementById("date-range");

    flatpickr(element, {
        mode: "range",
        locale: "pt",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        onClose: async function(selectedDates) {
            if (selectedDates.length === 2) {
                const startDate = selectedDates[0].toISOString().split('T')[0];
                const endDate = selectedDates[1].toISOString().split('T')[0];
                
                const retorno = await service.getExpensesByPeriod(startDate, endDate);

                renderExpensesList(retorno);
            }
        }
    });

}


import LocalStorageService from "./services/localStoregeService.js";
import Service from "./services/service.js";
import { toggleStatusVisual, fillFormForEdit, renderExpensesList, setLoading, showMessage, updateSummary, clearForm, getTodayDate, getMonthFromTheCurrentPeriod, getYearFromTheCurrentPeriod, renderExpensesItem } from "./ui.js";

//botao para limpar localstorege, Remover quando for para produção
const btnLimparLocalstorege = document.getElementById('btn-clear-localstorege');
btnLimparLocalstorege.addEventListener('click', () => {
    localStorage.clear();
    window.alert('LocalStorege resetado!');
});

let expenseData = [];
const varialble = "local";
const service = new Service(varialble);

const btnClearLocalStorege = document.getElementById("btn-clear-localstorege");
if (varialble === "local") {
    btnClearLocalStorege.style.display = "visible";
} else {
    btnClearLocalStorege.style.display = "none";
}
refreshExpenses();

async function refreshExpenses() {
    try {
        setLoading(true);

        expenseData = await service.getExpensesByMonth(getYearFromTheCurrentPeriod(), getMonthFromTheCurrentPeriod());
        //expenseData = await service.getExpenses();
        renderExpensesList(expenseData);
        updateSummary(expenseData);
    } catch (e) {
        showMessage("error", `Falha ao carregar: ${e.message}`);
    } finally {
        setLoading(false);
    }
}

async function handleSaveExpenses(event) {
    event.preventDefault();
    const form = event.target;
     
    const categoryTyped = document.getElementById('category-input').value.trim();
    const data = {
       
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        categoryName: categoryTyped,
        value: Number(form.value.value),
        payment: form.status.dataset.paid === "true",
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
            await service.updateExpenses(form.dataset.id, data);
            showMessage("success", "Conta atualizada.");
        } else {
            await service.createExpenses(data);
            showMessage("success", "Conta criada.");
        }

        // Limpa o formulario
        form.reset();
        document.getElementById('ghost-text').textContent = "";

        //Reset do botão de status
        const statusBtn = document.getElementById("status");
        statusBtn.dataset.pago = "false";
        statusBtn.textContent = "Pendente";
        
        // fecha o modal e atualiza a lista de despesas
        modal.style.display = "none";
        await refreshExpenses();
    } catch (e) {
        showMessage("error", `Erro: ${e.message}`);
    } finally {
        setLoading(false);
    }
    
}

async function handleListClick(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);
    
    const badge = event.target.closest(".badge");
    if(badge) {
        const expense = expenseData.find(e => e.id === id);
        if (expense) {
            try {
                const currentStatus = (expense.payment === true || expense.payment === "true");
                const newStatus = !currentStatus;

                await service.updateExpenses(id, { ...expense, payment: newStatus });
                
                expense.payment = newStatus;

                toggleStatusVisual(badge, newStatus);
                
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
            await refreshExpenses();
        } catch (e) {
            showMessage("error", `Erro ao excluir: ${e.message}`);
        } finally {
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

export function init() {
    document.getElementById("expenses-form").addEventListener("submit", handleSaveExpenses);
    document.getElementById("expenses-list").addEventListener("click", handleListClick);
    
}

document.addEventListener("DOMContentLoaded", init);

// MODAL
const btnAbrir = document.getElementById("btn-open-form");
const btnFechar = document.getElementById("btn-to-close");
const modal = document.getElementById("modal");
const dateInput = document.getElementById("date");

// Abrir modal
btnAbrir.addEventListener("click", () => {
    modal.style.display = "block";
    dateInput.value = getTodayDate();
});

// Fechar modal
btnFechar.addEventListener("click", () => {
    clearForm();
    modal.style.display = "none";
});

// Fechar clicando fora do modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    clearForm();
    modal.style.display = "none";
  }
});

//Sugestão da categoria
const categoriesData = await service.getCategory();
const categories = categoriesData.map(cat => cat.name);

const input = document.getElementById('category-input');
const ghost = document.getElementById('ghost-text');

input.addEventListener('input', () => {
    const value = input.value;
    
    if (!value) {
        ghost.textContent = "";
        return;
    }

    // Procura uma categoria ao digitar
    const match = categories.find(cat => 
        cat.toLowerCase().startsWith(value.toLowerCase())
    );

    if (match) {
        // O ghost text precisa ser o que o usuário digitou + o resto da palavra
        // Usamos o valor do input original para manter a capitalização do usuário
        ghost.textContent = value + match.slice(value.length);
    } else {
        ghost.textContent = "";
    }
});

// Aceitar a sugestão com Tab ou Seta para Direita
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

const statusBtnForm = document.getElementById("status");

//alterar status do botão
statusBtnForm.addEventListener("click", () => {
    const isPaid = statusBtnForm.dataset.paid === "true";
    toggleStatusVisual(statusBtnForm, !isPaid);
});

const nameFilter = document.getElementById("name-filter");

nameFilter.addEventListener('input', (event) => {
    const nameExpense = event.target.value();
    const expenses = getExpensesByName(nameExpense);
    renderExpensesList(expenses);
});

document.addEventListener("DOMContentLoaded", () => {
    refreshExpenses();
    document.getElementById("expenses-list").addEventListener("click", handleListClick);
});

initFlatpickr();

function initFlatpickr() {
    const element = document.getElementById("date-range");

    flatpickr(element, {
        mode: "range",
        locale: "pt",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        onClose: async function(selectedDates, dateStr) {
            if (selectedDates.length === 2) {
                const startDate = selectedDates[0].toISOString().split('T')[0];
                const endDate = selectedDates[1].toISOString().split('T')[0];
                
                const retorno = await service.getExpensesByPeriod(startDate, endDate);
                renderExpensesList(retorno);
            }
        }
    });

}


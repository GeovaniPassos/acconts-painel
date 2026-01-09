//import { createCategory, createExpenses, deleteExpenses, getCategory, getExpenses, getExpensesById, updateExpenses as updateExpense, updateExpenses } from "./api.js";
import { despesas } from "./data/despesas.js";
import { clearForm, fillFormForEdit, renderExpensesList, setLoading, showMessage, updateSummary } from "./ui-data.js";

let expenseData = despesas;

refreshExpenses();

async function refreshExpenses() {
    try {
        setLoading(true);
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
        payment: form.status.dataset.pago === "true",
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
                
                const newCategory = categoryCreate;

                categories.push(newCategory.name);
                if (typeof categoriesData != 'undefined') {
                    categoriesData.push(newCategory);
                }

            } catch (e) {
                showMessage("error", `Erro ao criar a categoria!`);
            }
        
        }

        if (form.dataset.mode === "edit" && form.dataset.id) {
            await updateExpense(form.dataset.id, data);
            showMessage("success", "Conta atualizada.");
        } else {
            await createExpenses(data);
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

                // 1. Atualiza no Banco
                await updateExpenses(id, { ...expense, payment: newStatus });
                
                // 2. Atualiza na Memória Local
                expense.payment = newStatus;

                // 3. Atualiza na UI (Usa a mesma função do formulário!)
                toggleStatusVisual(badge, newStatus);
                
                // 4. Atualiza os cards do topo
                updateSummary(expensesData);
                
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
            await deleteExpenses(id);
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
            const expenses = await getExpensesById(id);
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
    //document.getElementById("btn-carregar").addEventListener("click", loading);
    
}

document.addEventListener("DOMContentLoaded", init);

// MODAL
const btnAbrir = document.getElementById("btn-open-form");
const btnFechar = document.getElementById("btn-to-close");
const modal = document.getElementById("modal");
//const form = document.getElementById("expenses-form");
//const tabela = document.getElementById("expenses-list");

// Abrir modal
btnAbrir.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fechar modal
btnFechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fechar clicando fora do modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

//Sugestão da categoria
const categoriesData = despesas.map(cat => cat.category);

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
    
    // Inverte o estado atual baseado no dataset
    const isPaid = statusBtnForm.dataset.pago === "true";
    toggleStatusVisual(statusBtnForm, !isPaid);
});

document.addEventListener("DOMContentLoaded", () => {
    refreshExpenses();
    document.getElementById("expenses-list").addEventListener("click", handleListClick);
});
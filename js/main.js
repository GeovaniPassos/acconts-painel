import { createExpenses, deleteExpenses, getExpenses, getExpensesById, updateExpenses } from "./api.js";
import { clearForm, fillFormForEdit, renderExpensesList, setLoading, showMessage } from "./ui.js";

async function loading() {
    try {
        setLoading(true);
        const expenses = await getExpenses();
        renderExpensesList(expenses);
    } catch (e) {
        showMessage("error", `Falha ao carregar: ${e.message}`);
    } finally {
        setLoading(false);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        name: form.nome.value.trim(),
        value: Number(form.value.value)
    };
    if (!data.name || isNaN(data.value)) {
        showMessage("error", "Preencha o nome e o valor válido.");
        return;
    }
    
    try {
        setLoading(true);
        if (form.dataset.mode === "edit" && form.dataset.id) {
            await updateExpenses(form.dataset.id, data);
            showMessage("success", "Conta atualizada.");
        } else {
            await createExpenses(data);
            showMessage("success", "Conta criada.");
        }
        clearForm();
    } catch (e) {
        showMessage("error", `Erro: ${e.message}`);
    } finally {
        setLoading(false);
    }
}

async function handleListClick(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const id = li.dataset.id;

    if (event.target.classList.contains("btn-delete")) {
        if (!confirm("Excluir está conta?")) return;
        try {
            setLoading(true);
            await deleteExpenses(id);
            showMessage("success", "Conta excluída.");
            await loading();
        } catch (e) {
            showMessage("error", `Erro ao excluir: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    if (event.target.classList.contains("btn-edit")) {
        try {
            const expenses = await getExpensesById(id);
            fillFormForEdit(expenses);
        } catch (e) {
            showMessage("error", `Error ao buscar a despesa: ${e.message}`);
        }
    }
}

export function init() {
    //document.getElementById("expenses-form").addEventListener("submit", handleSubmit);
    document.getElementById("expenses-list").addEventListener("click", handleListClick);
    //document.getElementById("btn-carregar").addEventListener("click", loading);
    loading();
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
import { createExpenses, deleteExpenses, getCategory, getExpenses, getExpensesById, updateExpenses } from "./api.js";
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

//Sugestão da categoria

const categoriesData = await getCategory();
const categories = categoriesData.map(cat => cat.name);

const input = document.getElementById('category-input');
const ghost = document.getElementById('ghost-text');

input.addEventListener('input', () => {
    const value = input.value;
    
    if (!value) {
        ghost.textContent = "";
        return;
    }

    // Procura uma categoria que comece com o que foi digitado
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
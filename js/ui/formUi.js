import { formatDate, formatDateCalendar } from "../utils/date.js";
import { toggleStatusVisual } from "./paymentUi.js";
import * as expensesController from "../controllers/expensesController.js";
import { setLoading } from "./feedback.js";

export function bindFormSubmit() {
    document.getElementById("expenses-form").addEventListener("submit", handleSaveExpenses);
    document.getElementById("expenses-list").addEventListener("click", handleListClick);
}

export function clearForm() {
    const form = document.getElementById("expenses-form");
    form.dataset.id = "";
    form.reset();
    document.getElementById("name").disabled = false;
    document.getElementById("installments").disabled = false;
    document.querySelector(".modal-title").textContent = "Nova Despesa"
    document.querySelector(".installments").textContent = "Quantidade Parcelas:";
    // Reset do botão de status
    const statusBtn = document.querySelector(".btn-form-status");
    statusBtn.dataset.paid = "false";
    statusBtn.classList.add("status-pending");
    statusBtn.classList.remove("status-paid");
    statusBtn.textContent = "Pendente";
    
    // Limpa o campo de data de pagamento
    //document.querySelector(".expense-payment-date").value = "";
}

export function fillFormForEdit(expense) {
    const form = document.getElementById("expenses-form");
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title");
    const textInstallment = document.querySelector(".installments");

    form.dataset.mode = "edit";
    form.dataset.id = expense.id;

    const categoryInput = document.getElementById('category-input');
    categoryInput.value = expense.categoryName;
    document.getElementById('ghost-text').textContent = "";
    
    form.name.value = expense.name;
    document.getElementById("name").disabled = true;

    form.value.value = expense.value;
    form.description.value = expense.description;

    form.installments.value = expense.installment;
    textInstallment.textContent = "Número da parcela";
    document.getElementById("installments").disabled = true;

    const statusBtn = document.querySelector(".btn-form-status");
    toggleStatusVisual(statusBtn, expense.payment);
    
    form.paymentDate.value = formatDate(expense.paymentDate) || "";
    
    if (expense.date) {
        form.date.value = expense.date.split("T")[0];
    }

    if (modalTitle) modalTitle.textContent = "Editar despesa";

    modal.style.display = "block";
}

//Função para lidar com o salvamento da despesa
async function handleSaveExpenses(event) {
    //Para deixe o evento em espera enquanto não haver o clique
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
        paymentDate: formatDateCalendar(paymentDate),
        date: form.date.value
    };

    expensesController.handleSaveExpenses(data);
        
    
    // O retorno fazer de modo que insere e atualiza a lista
    
}

// Função para lidar com o clique no pagamento da despesa
async function handleListClick(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);
    const element = document.querySelector(`.expense-payment-date-${id}`);

    const btnDelete = event.target.closest(".btn-delete");
    if (btnDelete) {
        if (!confirm("Excluir está conta?")) return;
        expensesController.edeleteExpense(id);
    }

    const btnEdit = event.target.closest(".btn-edit");
    if (btnEdit) {
        expensesController.editExpense(id);
    }   
}
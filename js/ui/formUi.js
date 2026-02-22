import { formatDate } from "../utils/date.js";
import { toggleStatusVisual } from "./paymentUi.js";

export function bindFormSubmit(handler) {
    const form = document.getElementById("expenses-form");
    form.addEventListener("submit", handler);
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

export function fillFormForEdit(model) {
    const form = document.getElementById("expenses-form");
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title");
    const textInstallment = document.querySelector(".installments");

    form.dataset.mode = "edit";
    form.dataset.id = model.id;

    const categoryInput = document.getElementById('category-input');
    categoryInput.value = model.categoryName;
    document.getElementById('ghost-text').textContent = "";
    
    form.name.value = model.name;
    document.getElementById("name").disabled = true;

    form.value.value = model.value;
    form.description.value = model.description;

    form.installments.value = model.installments;
    textInstallment.textContent = "Número da parcela";
    document.getElementById("installments").disabled = true;

    const statusBtn = document.querySelector(".btn-form-status");
    toggleStatusVisual(statusBtn, model.payment);
    
    form.paymentDate.value = formatDate(expenses.paymentDate) || "";
    
    if (expenses.date) {
        form.date.value = expenses.date.split("T")[0];
    }

    if (modalTitle) modalTitle.textContent = "Editar despesa";

    modal.style.display = "block";
}
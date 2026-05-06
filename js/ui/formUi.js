import { formatDate, formatDateCalendar } from "../utils/date.js";
import { toggleStatusVisual } from "./paymentUi.js";
import * as expensesController from "../controllers/expensesController.js";
import * as receiptsController from "../controllers/receiptController.js";
import * as categoryController from "../controllers/categoriesController.js";
import { setLoading, showMessage } from "./feedback.js";
import { clearCategorySuggestions } from "./categoriesUi.js";


export function bindFormSubmit() {
    document.getElementById("expenses-form").addEventListener("submit", handleSave);
    document.getElementById("receipts-form").addEventListener("submit", handleSave);

}

export function bindTypeSelector() {
    const select = document.getElementById("type-select");

    if (!select) return;

    handleTypeChange(select.value);

    select.addEventListener("change", (event) => {
        handleTypeChange(event.target.value);
    });
}

function handleTypeChange(selectedType) {
    const sections = document.querySelectorAll(".form-section");

    sections.forEach(section => {
        const type = section.dataset.type;

        section.classList.toggle("hidden", type !== selectedType);

        if (type === selectedType) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });
}

export function clearForm() {
    const form = document.getElementById("expenses-form");
    form.dataset.id = "";
    form.reset();
    clearCategorySuggestions();
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
    
    form.name.value = expense.name;
    document.getElementById("name");

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
async function handleSave(event) {

    event.preventDefault();

    const typeRegistry = event.target.dataset.type;

    const form = event.target;
    const categoryTyped = document.querySelector('.category-input').value.trim();
    const paymentForm = document.querySelector(".btn-form-status").dataset.paid;
    let paymentDate = document.querySelector(".expense-payment-date").value;
    paymentDate = paymentForm == "true" ? paymentDate : "";
    
    let data = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        categoryName: categoryTyped.trim(),
        value: Number(form.value.value),
        date: form.date.value
    };
    
    if (typeRegistry === "expenses") {
        
            data.installment = 1;
            data.totalInstallments = Number(form.installments.value);
            data.payment = paymentForm;
            data.paymentDate = formatDateCalendar(paymentDate);
    }    

    if (!data.name || isNaN(data.value) || !data.categoryName) {
        showMessage("error", "Preencha o nome, valor e categoria pelo menos.");
        return;
    }

    try {
        setLoading(true);

        data.categoryName = await categoryController.findOrCreateCategory(data.categoryName, typeRegistry);

        //Salvar com base no modo edit ou criar se não for edit
        if (typeRegistry === "expenses") {

            if (form.dataset.mode === "edit" && form.dataset.id) {
                await expensesController.updateExpense(form.dataset.id, data);
            } else {
                await expensesController.createExpense(data);
            }

        } else if (typeRegistry === "receipt") {

            if (form.dataset.mode === "edit" && form.dataset.id) {
                await receiptsController.updateReceipts(form.dataset.id, data);
            } else {
                await receiptsController.createReceipts(data);
            }
        }

        // Limpa o formulario
        form.reset();
        //Reset do botão de status
        clearForm();

        document.querySelector(".expense-payment-date").value = "";
        
        modal.style.display = "none";
    } catch (e) {
        showMessage("error", `Erro: ${e.message}`);
    } finally {
        setLoading(false);
    }
}
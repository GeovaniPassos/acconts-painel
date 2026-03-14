import { formatDate, formatDateCalendar } from "../utils/date.js";
import { toggleStatusVisual } from "./paymentUi.js";
import * as expensesController from "../controllers/expensesController.js";
import * as categoryController from "../controllers/categoriesController.js";
import { setLoading } from "./feedback.js";
import { clearCategorySuggestions } from "./categoriesUi.js";


export function bindFormSubmit() {
    document.getElementById("expenses-form").addEventListener("submit", handleSaveExpenses);
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
        paymentDate: formatDateCalendar(paymentDate),
        date: form.date.value
    };
    //Checagem de inputs

    if (!data.name || isNaN(data.value) || !data.categoryName) {
        showMessage("error", "Preencha o nome, valor e categoria pelo menos.");
        return;
    }

    try {
        setLoading(true);
        // verificar existencia da categoria ou cria-la. o método é async!
        const category = await categoryController.checkCategory(data.categoryName);
        data.categoryName = category.name; 

        //Salvar com base no modo edit ou criar se não for edit
        if (form.dataset.mode === "edit" && form.dataset.id) {
            await expensesController.updateExpense(form.dataset.id, data);
        } else {
            await expensesController.createExpense(data);
        }

        // Limpa o formulario
        form.reset();
        //Reset do botão de status
        clearForm();

        // Limpa o campo de data de pagamento
        document.querySelector(".expense-payment-date").value = "";
        
        // fecha o modal e atualiza a lista de despesas
        modal.style.display = "none";
    } catch (e) {
        showMessage("error", `Erro: ${e.message}`);
    } finally {
        setLoading(false);
    }
}
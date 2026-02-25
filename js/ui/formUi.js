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
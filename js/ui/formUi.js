import { formatDate } from "../utils/date.js";
import { toggleStatusVisual } from "./paymentUi.js";

export function bindFormSubmit() {
    document.getElementById("expenses-form").addEventListener("submit", handleSaveExpenses);
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

    form.installments.value = expense.installments;
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
    console.log(event)
    //definir o tipo de evento
    event.preventDefault();

    //localizar os elementos pre carregados (data, categoria, pagamento/data do pagamento)
    const form = event.target;
    const categoryTyped = document.getElementById('category-input').value.trim();
    const paymentForm = document.querySelector(".btn-form-status").dataset.paid;
    let paymentDate = document.querySelector(".expense-payment-date").value;
    paymentDate = paymentForm == "true" ? paymentDate : "";

    //definir o que será editado/criado salvar em data para passar para create ou update
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

    //Checagem de inputs
    if (!data.name || isNaN(data.value || !data.categoryName)) {
        showMessage("error", "Preencha o nome, valor e categoria pelo menos.");
        return;
    }

    // TryCatch para entrar no saveSubmit
    try {
        setLoading(true);
        
        //Verificar existencia da categoria ou cria-la
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

        //Salvar com base no modo edit ou criar se não for edit
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
        //Buscar lista novamente (Editar para preencher lista em vez de buscar todos itens novamente)
        refreshExpenses();
        setLoading(false);
    }
    
}
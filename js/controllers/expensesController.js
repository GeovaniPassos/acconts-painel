import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";

import * as date from "../utils/date.js";
import * as feedback from "../ui/feedback.js";
import * as expenseUi from "../ui/expensesUi.js";
import * as sumary from "../ui/sumary.js";
import * as formUi from "../ui/formUi.js";
import * as core from "../core/expensesCore.js";

const service = new Service(VARIABLE_CONNECTION);

export function initExpenses() {
    renderExpenseListForMouth();
    // trazer do main handleSaveExpenses
    //formUi.bindFormSubmit(handleSaveExpenses);
}

export async function renderExpenseListForMouth() {
    try {
        feedback.setLoading(true);
        const list = await getListExpensesForMonth();
        expenseUi.renderExpensesList(list);
        sumary.updateSummary(list);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar: ${e.message}`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function getListExpensesForMonth() {
    const currentDate = date.getMonthAndYearFromCurrentPeriod();
    const expensesList = await service.getExpensesByMonth(currentDate.yearCurrent, currentDate.monthCurrent);
    
    return expensesList;
}

export function handleEditExpensesForm(expense) {
    //Função para normalizar dados Ex categoria_id = nome.categoria
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}

export async function getExpenseByPeriod(startDate, endDate) {
    const list = await service.getExpensesByPeriod(startDate, endDate);
    expenseUi.renderExpensesList(list);
}

export async function edeleteExpense(id) {
    try {
        await service.deleteExpenses(id);
        feedback.showMessage("success", "Conta excluída.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao excluir: ${e.message}`);
    } finally {
        renderExpenseListForMouth();
    }
}

export async function editExpense(id) {
    try {
        feedback.setLoading(true);
        const expenses = await service.getExpensesById(id);
        formUi.fillFormForEdit(expenses);
    } catch (e) {
        feedback.showMessage("error", `Error ao buscar a despesa: ${e.message}`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function handleSaveExpenses(data) {

    if (!data.name || isNaN(data.value || !data.categoryName)) {
        showMessage("error", "Preencha o nome, valor e categoria pelo menos.");
        return;
    }

    try {
        setLoading(true);
        
        //Verificar existencia da categoria ou cria-la
        // passa o nome da categoria, o backend checa se existe ou se é uma nova
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

        //controller chama uma função que faz tudo isso como padrão no Ui

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
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

export async function deleteExpense(id){
    try {
        setLoading(true);
        await service.deleteExpenses(id);
        showMessage("success", "Conta excluída.");
    } catch (e) {
        showMessage("error", `Erro ao excluir: ${e.message}`);
    } finally {
        getListExpensesForMonth();
        setLoading(false);
    }
}

export async function editExpense(id) {
    try {
        setLoading(true);
        const expenses = await service.getExpensesById(id);
        formUi.fillFormForEdit(expenses);
    } catch (e) {
        showMessage("error", `Error ao buscar a despesa: ${e.message}`);
    } finally {
        setLoading(false);
    }
}
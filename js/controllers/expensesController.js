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

export function handleEditExpenses(expense) {
    //Função para normalizar dados Ex categoria_id = nome.categoria
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}
import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";

import * as date from "../utils/date.js";
import * as feedback from "../ui/feedback.js";
import * as expenseUi from "../ui/expensesUi.js";
import * as sumary from "../ui/sumary.js";
import * as formUi from "../ui/formUi.js";
import * as core from "../core/expensesCore.js";

const service = new Service(VARIABLE_CONNECTION);
let expensesList = [];

export function initExpenses() {
    getListExpensesCurrentMonth();
}

export async function getListExpensesCurrentMonth() {
    try {
        feedback.setLoading(true);
        const currentDate = date.getMonthAndYearFromCurrentPeriod();
        expensesList = await service.getExpensesByMonth(currentDate.yearCurrent, currentDate.monthCurrent);
        expenseUi.renderExpensesList(expensesList);
        sumary.updateSummary(expensesList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar: ${e.message}`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function getExpensesByName(name) {
    expensesList = await service.getExpensesByName(name);
    expenseUi.renderExpensesList(expensesList);
    sumary.updateSummary(expensesList);
}

export async function handleEditExpensesForm(expenseId) {
    const expense = await service.getExpensesById(expenseId);
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}

export async function getExpenseByPeriod(startDate, endDate) {
    expensesList = await service.getExpensesByPeriod(startDate, endDate);
    expenseUi.renderExpensesList(expensesList);
}

export function updateExpensesList(expensesList) {
    expenseUi.renderExpensesList(expensesList);
    sumary.updateSummary(expensesList);
}

export function updateItemExpensesList(expense) {
    expensesList = core.updateItemExpensesList(expense, expensesList);
    updateExpensesList(expensesList);
}

export async function updateExpense(id, data) {
    try {
        feedback.setLoading(true);
        const result = await service.updateExpenses(id, data);

        expensesList = core.updateItemExpensesList(result, expensesList);
        updateExpensesList(expensesList);

        feedback.showMessage("success", "Despesa atualizada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao atualizar despesa: ${e.message}`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function createExpense(data) {
    try {
        feedback.setLoading(true);
        await service.createExpenses(data);
       
        expensesList = core.addToList(expensesList, data);
        updateExpensesList(expensesList);
       
        feedback.showMessage("success", "Despesa criada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao criar despesa: ${e.message}`);
    } finally {
        feedback.setLoading(false);
    }  
}

export async function deleteExpense(id) {
    try {
        feedback.setLoading(true);
        await service.deleteExpenses(id);
        
        expensesList = core.removeItemExpensesList(id, expensesList);
        updateExpensesList(expensesList);
        
        feedback.showMessage("success", "Despesa deletada com sucesso.");
    } catch (e) {
        feedback.showMessage("error",`Erro ao deletar a despesa com o ${id}.`)
    } finally {
        feedback.setLoading(false);
    }
}   
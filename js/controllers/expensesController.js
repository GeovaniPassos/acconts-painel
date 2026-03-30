import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";

import * as date from "../utils/date.js";
import * as feedback from "../ui/feedback.js";
import * as expenseUi from "../ui/expensesUi.js";
import * as sumary from "../ui/sumary.js";
import * as formUi from "../ui/formUi.js";
import * as core from "../core/expensesCore.js";
import { searchParams } from "./searchController.js";

const service = new Service(VARIABLE_CONNECTION);
let expensesList = [];

export function initExpenses() {
    getListExpensesCurrentMonth();
}

export async function getListExpensesCurrentMonth() {
    try {
        feedback.setLoading(true);
        searchParams.startDate = date.getCurrentMonthPeriod().startDate;
        searchParams.endDate = date.getCurrentMonthPeriod().endDate;
        searchParams.name = "";
        expensesList = await service.getExpenses(searchParams.startDate, searchParams.endDate, searchParams.name);
        if (expensesList === null || expensesList.expenses.length == 0) {
            return feedback.showMessage("info", "Nenhuma despesa encontrada.");
        }
        expenseUi.renderExpensesList(expensesList);
        sumary.updateSummary(expensesList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function getExpensesBySearch(searchParams) {
    try {
        feedback.setLoading(true);
        expensesList = await service.getExpenses(searchParams.startDate, searchParams.endDate, searchParams.name);

        if (expensesList.expenses.length == 0) {
            feedback.showMessage("info", "Nenhuma despesa encontrada para o período e nome informados.");
        }
        expenseUi.renderExpensesList(expensesList);
        sumary.updateSummary(expensesList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function handleEditExpensesForm(expenseId) {
    const expense = await service.getExpensesById(expenseId);
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}

export async function updateExpense(id, data) {
    try {
        feedback.setLoading(true);
        await service.updateExpenses(id, data);
        
        getExpensesBySearch(searchParams);
        
        feedback.showMessage("success", "Despesa atualizada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao atualizar despesa.`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function createExpense(data) {
    try {
        feedback.setLoading(true);
        await service.createExpenses(data);
       
        getExpensesBySearch(searchParams);
       
        feedback.showMessage("success", "Despesa criada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao criar despesa.`);
    } finally {
        feedback.setLoading(false);
    }  
}

export async function deleteExpense(id) {
    try {
        feedback.setLoading(true);
        await service.deleteExpenses(id);
        
        getExpensesBySearch(searchParams);
        
        feedback.showMessage("success", "Despesa deletada com sucesso.");
    } catch (e) {
        feedback.showMessage("error",`Erro ao deletar a despesa com o ${id}.`)
    } finally {
        feedback.setLoading(false);
    }
}   
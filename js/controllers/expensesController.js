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
        searchParams.months = [];
        searchParams.paymentStatus = "all";
        expensesList = await service.getExpenses(searchParams.startDate, searchParams.endDate, searchParams.name);
        const allExpenses = await service.getExpenses();
        if (expensesList === null || expensesList.expenses.length == 0) {
            expenseUi.renderExpensesList(expensesList || { expenses: [] }, allExpenses || { expenses: [] });
            sumary.updateSummary(expensesList || { expenses: [] });
            return feedback.showMessage("info", "Nenhuma despesa encontrada.");
        }
        expenseUi.renderExpensesList(expensesList, allExpenses || { expenses: [] });
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
        const selectedMonths = searchParams.months || [];
        const selectedYear = (searchParams.startDate || `${new Date().getFullYear()}-01-01`).slice(0, 4);
        const queryStartDate = selectedMonths.length ? `${selectedYear}-01-01` : searchParams.startDate;
        const queryEndDate = selectedMonths.length ? `${selectedYear}-12-31` : searchParams.endDate;

        expensesList = await service.getExpenses(queryStartDate, queryEndDate, searchParams.name);

        if (selectedMonths.length || searchParams.paymentStatus !== "all") {
            expensesList = filterExpenses(expensesList, searchParams, selectedMonths);
        }
        const allExpenses = await service.getExpenses();
        if (expensesList.expenses.length == 0) {
            expenseUi.renderExpensesList(expensesList, allExpenses || { expenses: [] });
            sumary.updateSummary(expensesList);
            return feedback.showMessage("info", "Nenhuma despesa encontrada para o período e nome informados.");
        }
        expenseUi.renderExpensesList(expensesList, allExpenses || { expenses: [] });
        sumary.updateSummary(expensesList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar`);
    } finally {
        feedback.setLoading(false);
    }
}

function filterExpenses(result, filters, selectedMonths) {
    const expenses = (result.expenses || []).filter(expense => {
        const expenseMonth = String(expense.date || "").slice(5, 7);
        const isSelectedMonth = !selectedMonths.length || selectedMonths.includes(expenseMonth);
        const isInPeriod = !filters.startDate || !filters.endDate
            || (expense.date >= filters.startDate && expense.date <= filters.endDate);
        const isPaid = expense.payment === true || expense.payment === "true";
        const matchesPaymentStatus = filters.paymentStatus === "all"
            || (filters.paymentStatus === "paid" && isPaid)
            || (filters.paymentStatus === "unpaid" && !isPaid);

        return isSelectedMonth && isInPeriod && matchesPaymentStatus;
    });

    const totalPaid = expenses
        .filter(expense => expense.payment === true || expense.payment === "true")
        .reduce((total, expense) => total + Number(expense.value || 0), 0);
    const totalUnpaid = expenses
        .filter(expense => expense.payment !== true && expense.payment !== "true")
        .reduce((total, expense) => total + Number(expense.value || 0), 0);

    return {
        ...result,
        expenses,
        totalPaid,
        totalUnpaid,
        total: totalPaid + totalUnpaid
    };
}

export async function handleEditExpensesForm(expenseId) {
    const expense = await service.getExpensesById(expenseId);
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}

export async function updateExpenseCashflowCard(expenseId, cardId = null, cardName = null) {
    try {
        await service.updateExpenses(expenseId, {
            cashflowCardId: cardId,
            cashflowCardName: cardName
        });
    } catch (e) {
        feedback.showMessage("error", "Não foi possível salvar o card da despesa.");
        throw e;
    }
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

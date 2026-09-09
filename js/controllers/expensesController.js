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
        const sortedExpenses = sortExpenses(expensesList || { expenses: [] }, searchParams);
        if (expensesList === null || expensesList.expenses.length == 0) {
            expenseUi.renderExpensesList(sortedExpenses, allExpenses || { expenses: [] });
            sumary.updateSummary(sortedExpenses);
            return feedback.showMessage("info", "Nenhuma despesa encontrada.");
        }
        expenseUi.renderExpensesList(sortedExpenses, allExpenses || { expenses: [] });
        sumary.updateSummary(sortedExpenses);
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
        expensesList = sortExpenses(expensesList, searchParams);
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

function sortExpenses(result, filters) {
    const expenses = [...(result?.expenses || [])];

    expenses.sort((first, second) => {
        if (filters.sortBy === "name") {
            return compareText(first.name, second.name);
        }

        if (filters.sortBy === "category") {
            return compareText(first.categoryName, second.categoryName)
                || compareText(first.name, second.name);
        }

        return compareDate(getCreationDate(first), getCreationDate(second))
            || Number(first.id || 0) - Number(second.id || 0);
    });

    return { ...result, expenses };
}

function compareText(first, second) {
    return String(first || "").localeCompare(String(second || ""), "pt-BR", {
        sensitivity: "base"
    });
}

function compareDate(first, second) {
    return String(first || "").localeCompare(String(second || ""));
}

function getCreationDate(expense) {
    return expense.createdAt
        || expense.createdDate
        || expense.creationDate
        || expense.created_at
        || "";
}

export async function handleEditExpensesForm(expenseId) {
    const expense = await service.getExpensesById(expenseId);
    const formModel = core.buildEditFormModel(expense);
    formUi.fillFormForEdit(formModel);
}

export async function updateExpenseCashflowCard(expenseId, cardId = null) {
    try {
        await service.updateExpenseCashflowCard(expenseId, cardId);
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

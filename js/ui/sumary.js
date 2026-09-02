import { formatMoney } from "../utils/money.js"
import { searchParams } from "../controllers/searchController.js"

let currentExpenses = null;
let currentReceipts = null;
let totalPaid = null;

export function updateSummary(expensesList) {
    currentExpenses = expensesList;
    renderSummary();
}

export function updateReceiptSummary(receiptsList) {
    currentReceipts = receiptsList;
    renderSummary();
}

function getReceiptTotal(receiptsList) {
    const receipts = receiptsList?.receipt || [];
    return receipts.reduce((total, receipt) => total + Number(receipt.value || 0), 0);
}

function getExpenseTotal(expensesList) {
    if (Number.isFinite(Number(expensesList?.total))) {
        return Number(expensesList.total);
    }

    const expenses = expensesList?.expenses || [];
    return expenses.reduce((total, expense) => total + Number(expense.value || 0), 0);
}

function hasExpenses() {
    return currentExpenses?.expenses && currentExpenses.expenses.length > 0;
}

function hasReceipts() {
    return currentReceipts?.receipt && currentReceipts.receipt.length > 0;
}

function isActiveSearchByName() {
    return searchParams.name && searchParams.name.trim() !== "";
}

function showCard(cardId) {
    const card = document.querySelector(`#${cardId}`).parentElement;
    if (card) card.style.display = "flex";
}

function hideCard(cardId) {
    const card = document.querySelector(`#${cardId}`).parentElement;
    if (card) card.style.display = "none";
}

function updateVisibilityBasedOnSearch() {
    const hasExp = hasExpenses();
    const hasRec = hasReceipts();

    // Mostrar todos os cards inicialmente
    showCard('total-geral');
    showCard('total-pago');
    showCard('total-pendente');
    showCard('total-receitas');
    showCard('saldo-total');

    // Aplicar lógica condicional apenas se houver busca ativa por nome
    if (isActiveSearchByName()) {
        if (hasExp && !hasRec) {
            // Apenas despesas: mostrar débitos, pago e pendente
            hideCard('total-receitas');
            hideCard('saldo-total');
        } else if (!hasExp && hasRec) {
            // Apenas receitas: mostrar apenas total de receitas
            hideCard('total-geral');
            hideCard('total-pago');
            hideCard('total-pendente');
            hideCard('saldo-total');
        }
        // Se houver ambos (hasExp && hasRec), mostrar todos
    }
}

function renderSummary() {
    const expenses = currentExpenses || {};
    const expenseTotal = getExpenseTotal(currentExpenses);
    const receiptTotal = getReceiptTotal(currentReceipts);

    document.getElementById('total-geral').textContent = formatMoney(expenseTotal);
    document.getElementById('total-pago').textContent = formatMoney(Number(expenses.totalPaid || 0));
    document.getElementById('total-pendente').textContent = formatMoney(Number(expenses.totalUnpaid || 0));
    document.getElementById('total-receitas').textContent = formatMoney(receiptTotal);
    document.getElementById('saldo-total').textContent = formatMoney(receiptTotal - expenses.totalPaid);

    updateVisibilityBasedOnSearch();
}
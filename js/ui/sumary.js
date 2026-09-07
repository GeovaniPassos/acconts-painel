import { formatMoney } from "../utils/money.js"

let currentExpenses = null;
let currentReceipts = null;

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

function getExpenseTotals(expensesList) {
    const expenses = expensesList?.expenses || [];
    const totalPaid = expenses
        .filter(expense => expense.payment === true || expense.payment === "true")
        .reduce((total, expense) => total + Number(expense.value || 0), 0);
    const totalUnpaid = expenses
        .filter(expense => expense.payment !== true && expense.payment !== "true")
        .reduce((total, expense) => total + Number(expense.value || 0), 0);

    return { totalPaid, totalUnpaid, total: totalPaid + totalUnpaid };
}

function hasActiveExpenseFilters() {
    return Boolean(
        document.getElementById("searchName")?.value.trim()
        || document.getElementById("date-range")?.value
        || document.querySelector('input[name="expense-month"]:checked')
        || (document.getElementById("payment-filter")?.value || "all") !== "all"
    );
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
    // Mostrar todos os cards inicialmente
    showCard('total-geral');
    showCard('total-pago');
    showCard('total-pendente');
    showCard('total-receitas');
    showCard('saldo-total');

    // Os filtros são exclusivos das despesas; receitas e saldo não devem
    // misturar valores de períodos ou conjuntos diferentes.
    if (hasActiveExpenseFilters()) {
        hideCard('total-receitas');
        hideCard('saldo-total');
    }
}

function renderSummary() {
    const expenseTotals = getExpenseTotals(currentExpenses);
    const receiptTotal = getReceiptTotal(currentReceipts);

    document.getElementById('total-geral').textContent = formatMoney(expenseTotals.total);
    document.getElementById('total-pago').textContent = formatMoney(expenseTotals.totalPaid);
    document.getElementById('total-pendente').textContent = formatMoney(expenseTotals.totalUnpaid);
    document.getElementById('total-receitas').textContent = formatMoney(receiptTotal);
    document.getElementById('saldo-total').textContent = formatMoney(receiptTotal - expenseTotals.totalPaid);

    updateVisibilityBasedOnSearch();
}

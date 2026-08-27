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

function getExpenseTotal(expensesList) {
    if (Number.isFinite(Number(expensesList?.total))) {
        return Number(expensesList.total);
    }

    const expenses = expensesList?.expenses || [];
    return expenses.reduce((total, expense) => total + Number(expense.value || 0), 0);
}

function renderSummary() {
    const expenses = currentExpenses || {};
    const expenseTotal = getExpenseTotal(currentExpenses);
    const receiptTotal = getReceiptTotal(currentReceipts);

    document.getElementById('total-geral').textContent = formatMoney(expenseTotal);
    document.getElementById('total-pago').textContent = formatMoney(Number(expenses.totalPaid || 0));
    document.getElementById('total-pendente').textContent = formatMoney(Number(expenses.totalUnpaid || 0));
    document.getElementById('total-receitas').textContent = formatMoney(receiptTotal);
    document.getElementById('saldo-total').textContent = formatMoney(receiptTotal - expenseTotal);
}
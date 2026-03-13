import { formatMoney } from "../utils/money.js"

export function updateSummary(expensesList) {

    // Atualizando o DOM com formatação de moeda brasileira
    document.getElementById('total-geral').textContent = formatMoney(expensesList.total);
    document.getElementById('total-pago').textContent = formatMoney(expensesList.totalPaid);
    document.getElementById('total-pendente').textContent = formatMoney(expensesList.totalUnpaid);
}
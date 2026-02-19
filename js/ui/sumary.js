import { calculateExpenses } from "../core/updateSummaryCore.js";
import { formatCurrency } from "../utils/money.js"

export function updateSummary(expensesList) {
    debugger
    const totals = calculateExpenses(expensesList);

    // Atualizando o DOM com formatação de moeda brasileira
    document.getElementById('total-geral').textContent = formatCurrency(totals.total);
    document.getElementById('total-pago').textContent = formatCurrency(totals.paid);
    document.getElementById('total-pendente').textContent = formatCurrency(totals.pending);
}
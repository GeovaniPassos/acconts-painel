import { calculateExpenses } from "../core/updateSummaryCore.js";
import { formatMoney } from "../utils/money.js"

export function updateSummary(expensesList) {
    const totals = calculateExpenses(expensesList);

    // Atualizando o DOM com formatação de moeda brasileira
    document.getElementById('total-geral').textContent = formatMoney(totals.total);
    document.getElementById('total-pago').textContent = formatMoney(totals.paid);
    document.getElementById('total-pendente').textContent = formatMoney(totals.pending);
}
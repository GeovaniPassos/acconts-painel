import { calculateExpenses } from "../core/updateSummaryCore.js";
import { formatCurrency } from "../utils/money.js"

export function updateSummary(expensesList) {
    const totals = calculateExpenses(expensesList);
    
    // Atualizando o DOM com formatação de moeda brasileira
    document.getElementById('total-geral').textContent = totals.total;
    document.getElementById('total-pago').textContent = totals.paid;
    document.getElementById('total-pendente').textContent = totals.pending;
}
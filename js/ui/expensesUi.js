import { renderExpensesItem } from "../ui";

// export function initExpenses() {
//     expensesController.listExpenseForMonth(renderExpenses);
// }

// export function refreshExpenses() {
//     try {
//         setLoading(true);

//         //await service.getExpensesByMonth(getYearFromTheCurrentPeriod(), 
//         // getMonthFromTheCurrentPeriod());
//         renderExpensesList(expenseData);
//         updateSummary(expenseData);
//     } catch (e) {
//         showMessage("error", `Falha ao carregar: ${e.message}`);
//     } finally {
//         setLoading(false);
//     }
// }

export function renderExpenseListForMouth() {
    
}

export function renderExpensesList(expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";

    expenses.forEach(exp => {
        ul.appendChild(renderExpensesItem(exp));
    });
}

//Função para renderizar a lista de despesas
function renderExpensesItem(expense) {
    const li = document.createElement("li");
    li.dataset.id = expense.id;
    li.className = "expense-item";

    const idPaid = expense.payment === true || expense.payment === "true";

    const statusClass = idPaid ? "status-paid" : "status-pending";
    const statusText = idPaid ? "Pago" : "Pendente";
    li.innerHTML = `
        <div class="info-group main">
            <strong class="expense-name">${expense.name}</strong>
            <span class="expense-category">${expense.categoryName}</span>
        </div>

        <div class="info-group finance">
            <div class="group-value-date">
                <span class="expense-value">R$ ${Number(expense.value).toLocaleString(
                        'pt-BR', { minimumFractionDigits: 2 })}</span>
                <span class="expense-date">${formatDate(expense.date)}</span>
            </div>
            <div class="group-installments">
                <span class="expense-installments">${expense.installment}/${expense.totalInstallments}</span>
            </div>
        </div>

        <div class="info-group status">
            <span class="badge btn-table-status ${statusClass}" data-paid="false">${statusText}</span>
            <span class="expense-date payment-date expense-payment-date-${expense.id}">${formatDate(expense.paymentDate)}</span>
        </div>

        <div class="actions">
            <button class="btn-edit btn-icon" title="Editar">✏️</button>
            <button class="btn-delete btn-icon" title="Deletar">🗑️</button>
        </div>
    `;

    return li;
}
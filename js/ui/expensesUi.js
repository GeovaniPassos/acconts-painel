import { expenses } from "../data/expenses";
import { renderExpensesItem } from "../ui";

export function initExpenses() {
    expensesController.listExpenseForMonth(renderExpenses);
}

function renderExpenses(expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";

    expenses.forEach(exp => {
        ul.appendChild(renderExpensesItem(exp));
    });
}
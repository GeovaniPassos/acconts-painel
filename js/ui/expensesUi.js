import { formatDate } from "../utils/date.js";
import { formatMoney } from "../utils/money.js";
import * as expensesController from "../controllers/expensesController.js"

let latestFlowExpenses = [];

document.addEventListener("cashflow:cards-ready", () => {
    if (latestFlowExpenses.length) renderExpensesFlow(latestFlowExpenses);
});

export function renderExpensesList(expenses, flowExpenses = expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";

    expenses.expenses.forEach(exp => {
        ul.appendChild(renderExpensesItem(exp));
    });

    renderExpensesFlow(flowExpenses.expenses);
}

// O fluxo recebe a lista completa, separada da lista filtrada de despesas,
// porque um elemento não pode existir em dois lugares do DOM.
function renderExpensesFlow(expenses) {
    latestFlowExpenses = expenses;
    const layout = document.querySelector(".cashflow-layout");
    const unpaid = document.getElementById("cashflow-unpaid");
    const paid = document.querySelector(".cashflow-paid");
    const board = document.querySelector(".cashflow-board");

    if (!layout || !unpaid || !paid || !board) return;

    board.cashflowExpenses = expenses;
    document.dispatchEvent(new CustomEvent("cashflow:sync-cards", { detail: expenses }));

    clearFlowExpenses(layout);

    const unpaidExpenses = expenses
        .filter(expense => expense.payment !== true && expense.payment !== "true")
        .sort((first, second) => String(first.date || "").localeCompare(String(second.date || "")));

    unpaidExpenses.forEach(expense => {
        const item = renderExpensesItem(expense, { cashflow: true });
        const forecastCard = expense.cashflowCardId == null
            ? null
            : board.querySelector(`.cashflow-card[data-id="${expense.cashflowCardId}"]`);

        if (forecastCard?.isConnected) {
            forecastCard.appendChild(item);
        } else {
            unpaid.appendChild(item);
        }
    });

    expenses
        .filter(expense => expense.payment === true || expense.payment === "true")
        .sort((first, second) => getExpenseDateForSort(second).localeCompare(getExpenseDateForSort(first)))
        .slice(0, 10)
        .forEach(expense => {
            paid.appendChild(renderExpensesItem(expense, { cashflow: true }));
        });

    document.dispatchEvent(new CustomEvent("cashflow:update-totals"));
}

function getExpenseDateForSort(expense) {
    const value = expense.paymentDate || expense.date || "";
    const [day, month, year] = String(value).split("/");

    return year && month && day ? `${year}-${month}-${day}` : String(value);
}

function clearFlowExpenses(layout = document.querySelector(".cashflow-layout")) {
    layout?.querySelectorAll(".cashflow-expense-item").forEach(item => item.remove());
}

//Função para renderizar a lista de despesas
function renderExpensesItem(expense, { cashflow = false } = {}) {
    const li = document.createElement("li");
    li.dataset.id = expense.id; 
    li.dataset.paid = expense.payment === true || expense.payment === "true";
    li.dataset.dueDate = expense.date || "";
    li.dataset.value = expense.value || 0;
    li.className = `expense-item${cashflow ? " cashflow-expense-item" : ""}`;

    if (cashflow) {
        li.setAttribute("tabindex", "0");
        li.setAttribute("aria-expanded", "false");
        li.setAttribute("aria-label", `Ver detalhes de ${expense.name}`);
    }

    const idPaid = expense.payment === true || expense.payment === "true";

    const statusClass = idPaid ? "status-paid" : "status-pending";
    const statusText = idPaid ? "Pago" : (cashflow ? "Pagar" : "Pendente");
    const statusTitle = idPaid
        ? "Clique para marcar como pendente"
        : "Clique para marcar como paga";
    li.innerHTML = `
        <div class="info-group main">
            <strong class="expense-name">${expense.name}</strong>
            <span class="expense-description">${expense.description}</span>
        </div>
        <div class="expense-category">
            <span>${expense.categoryName}</span>
        </div>
        <div class="info-group finance">
            <div class="group-value-date">
                <span class="expense-value">${formatMoney(expense.value)}</span>
                <span class="expense-date">${formatDate(expense.date)}</span>
            </div>
            <div class="group-installments">
                <span class="expense-installments">${expense.installment}/${expense.totalInstallments}</span>
            </div>
        </div>

        <div class="info-group status">
            <button type="button" class="badge btn-table-status ${statusClass}" data-paid="${expense.payment}" title="${statusTitle}">${statusText}</button>
            <span class="expense-date payment-date expense-payment-date-${expense.id}">${idPaid ? formatDate(expense.paymentDate) : "-"}</span>
        </div>

        <div class="actions">
            <button class="btn-edit btn-icon " title="Editar">✏️</button>
            <button class="btn-delete btn-icon" title="Deletar">🗑️</button>
        </div>
    `;

    // Contas já pagas permanecem somente no painel de pagas no fluxo.
    li.setAttribute("draggable", String(!cashflow || !idPaid));
    li.classList.add('item');

    return li;
}

async function handleListClick(event) {
    const li = event.target.closest("li");
    if (!li) return;

    const isCashflowItem = li.classList.contains("cashflow-expense-item");
    const clickedControl = event.target.closest("button, input, select, textarea, label, a");

    if (isCashflowItem && !clickedControl) {
        const isExpanded = li.classList.toggle("is-expanded");
        li.setAttribute("aria-expanded", String(isExpanded));
        li.setAttribute(
            "aria-label",
            `${isExpanded ? "Ocultar" : "Ver"} detalhes de ${li.querySelector(".expense-name")?.textContent || "despesa"}`
        );
        return;
    }

    const id = Number(li.dataset.id);
    const btnDelete = event.target.closest(".btn-delete");
    if (btnDelete) {
        if (!confirm("Excluir está conta?")) return;
        expensesController.deleteExpense(id);
    }

    const btnEdit = event.target.closest(".btn-edit");
    if (btnEdit) {
        expensesController.handleEditExpensesForm(id);
    }
}

export function bindExpensesListClick() {
    document.getElementById("expenses-list").addEventListener("click", handleListClick);

    const flow = document.querySelector(".cashflow-layout");
    flow?.addEventListener("click", handleListClick);
    flow?.addEventListener("keydown", event => {
        const item = event.target.closest(".cashflow-expense-item");
        if (!item || !["Enter", " "].includes(event.key)) return;
        if (event.target.closest("button, input, select, textarea, label, a")) return;

        event.preventDefault();
        item.click();
    });
}

export function bindBtnCurrentMonthExpenses() {
    document.getElementById("btn-current-month").addEventListener("click", () => {
        document.querySelectorAll('input[name="expense-month"]:checked')
            .forEach(month => { month.checked = false; });
        document.getElementById("payment-filter").value = "";
        expensesController.getListExpensesCurrentMonth();
    });
}

export function emptyExpensesList() {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    clearFlowExpenses();

    const li = document.createElement("li");
    li.innerHTML = "Nenhuma despesa informada nesse período.";
    ul.appendChild(li);
}

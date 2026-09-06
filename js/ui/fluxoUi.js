let cashflowCardId = 1;
let cashflowInitialized = false;
let draggedExpense = null;

function showDeleteCardWarning() {
    const modal = document.getElementById("cashflow-warning-modal");
    const closeButton = document.getElementById("cashflow-warning-close");

    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    closeButton?.focus();
}

function closeDeleteCardWarning() {
    const modal = document.getElementById("cashflow-warning-modal");
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
}

function bindDeleteCardWarningModal() {
    const modal = document.getElementById("cashflow-warning-modal");
    const closeButton = document.getElementById("cashflow-warning-close");

    closeButton?.addEventListener("click", closeDeleteCardWarning);
    modal?.addEventListener("click", event => {
        if (event.target === modal) closeDeleteCardWarning();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal?.classList.contains("is-open")) {
            closeDeleteCardWarning();
        }
    });
}

function insertUnpaidExpenseByDueDate(panel, expense) {
    const dueDate = expense.dataset.dueDate || "";
    const nextExpense = [...panel.querySelectorAll(":scope > .cashflow-expense-item")]
        .find(item => dueDate.localeCompare(item.dataset.dueDate || "") < 0);

    panel.insertBefore(expense, nextExpense || null);
}

function createCashflowCard(id) {

    const card = document.createElement("div");

    card.className = "cashflow-panel cashflow-card";
    card.dataset.id = id;

    card.innerHTML = `
        <div class="cashflow-card-header">

            <p style="font-size: 1.2rem;">Previsão Pgto:</p>
            <input
                class="cashflow-card-input" type="text" placeholder="Descrição" maxlength="40">

            <span class="cashflow-card-title" title="Clique para editar"></span>
            <span class="cashflow-card-space"></span>

            <button class="cashflow-card-delete" type="button" title="Excluir card">❌</button>
        </div>
    `;

    return card;
}

function handleCashflowCardClick(event, board) {
    const card = event.target.closest(".cashflow-card");
    if (!card) return;

    if (event.target.closest(".cashflow-card-delete")) {
        const hasExpenses = card.querySelector(".cashflow-expense-item");
        if (hasExpenses) {
            showDeleteCardWarning();
            return;
        }
        card.remove();
        return;
    }

    const title = event.target.closest(".cashflow-card-title");
    if (title) {
        const input = card.querySelector(".cashflow-card-input");
        input.style.display = "inline-block";
        title.style.display = "none";
        input.focus();
    }

    if (event.target.closest(".cashflow-card-input")) {
        return;
    }

    if (event.target === board) {
        return;
    }
}

function handleCashflowCardKeydown(event) {
    if (event.key !== "Enter" || !event.target.matches(".cashflow-card-input")) return;

    const value = event.target.value.trim();
    if (!value) return;

    const card = event.target.closest(".cashflow-card");
    const title = card.querySelector(".cashflow-card-title");
    title.textContent = value;
    event.target.style.display = "none";
    title.style.display = "inline";
    card.dataset.name = value;
}

export function initCashflow() {

    if (cashflowInitialized) return;

    const layout = document.querySelector(".cashflow-layout");
    const board = document.querySelector(".cashflow-board");
    const addButton = document.querySelector(".cashflow-add-button");

    if (!layout || !board || !addButton) return;

    bindDeleteCardWarningModal();

    // DRAG START
    layout.addEventListener("dragstart", (event) => {

        const expense = event.target.closest(".expense-item");
        if (!expense) return;
        draggedExpense = expense;
        event.dataTransfer.effectAllowed = "move";
    });

    // Permite soltar em um card de previsão ou devolver uma despesa pendente
    // ao painel de contas não pagas.
    layout.addEventListener("dragover", (event) => {
        const target = event.target.closest(".cashflow-card, .cashflow-unpaid");

        if (!target) return;

        event.preventDefault();

        event.dataTransfer.dropEffect = "move";
    });

    // DROP
    layout.addEventListener("drop", (event) => {
        const target = event.target.closest(".cashflow-card, .cashflow-unpaid");
        if (!target) return;
        event.preventDefault();
        if (!draggedExpense) return;

        const isPaid = draggedExpense.dataset.paid === "true";
        if (target.classList.contains("cashflow-unpaid") && isPaid) return;

        if (target.classList.contains("cashflow-unpaid")) {
            insertUnpaidExpenseByDueDate(target, draggedExpense);
        } else {
            target.appendChild(draggedExpense);
        }
        draggedExpense = null;
    });

    // DRAG END
    layout.addEventListener("dragend", () => {
        draggedExpense = null;
    });

    // ADICIONAR BLOCO
    addButton.addEventListener("click", () => {
        const card = createCashflowCard(cashflowCardId);
        cashflowCardId++;
        board.insertBefore(
            card,
            addButton.closest(".cashflow-add-card")
        );
    });

    // CLICK
    layout.addEventListener("click", (event) => {
        handleCashflowCardClick(event);
    });

    // KEYDOWN
    layout.addEventListener("keydown", handleCashflowCardKeydown);
    cashflowInitialized = true;
}

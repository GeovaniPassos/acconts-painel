let cashflowCardId = 1;
let cashflowInitialized = false;
let draggedExpense = null;

import * as expensesController from "../controllers/expensesController.js";
import * as cashflowCardController from "../controllers/cashflowCardController.js";
import { showMessage } from "./feedback.js";

let cashflowCards = [];

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

function createCashflowCard(id, name = "") {

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

    if (name) setCashflowCardName(card, name);

    return card;
}

function setCashflowCardName(card, name) {
    const input = card.querySelector(".cashflow-card-input");
    const title = card.querySelector(".cashflow-card-title");

    card.dataset.name = name;
    input.value = name;
    input.style.display = "none";
    title.textContent = name;
    title.style.display = "inline";
}

function syncCashflowCards(board) {
    const addCard = board.querySelector(".cashflow-add-card");
    if (!addCard) return;

    const cardsFromExpenses = [...cashflowCards].sort((first, second) => Number(first.id) - Number(second.id));

    const cardsById = new Map(
        [...board.querySelectorAll(".cashflow-card")].map(card => [String(card.dataset.id), card])
    );
    const persistedIds = new Set(cardsFromExpenses.map(card => String(card.id)));

    board.querySelectorAll('.cashflow-card[data-persisted="true"]').forEach(card => {
        if (!persistedIds.has(String(card.dataset.id))) card.remove();
    });

    cardsFromExpenses.forEach(cardData => {
        let card = cardsById.get(String(cardData.id));
        if (!card || !card.isConnected) {
            card = createCashflowCard(cardData.id, cardData.name);
        } else if (card.dataset.name !== cardData.name) {
            setCashflowCardName(card, cardData.name);
        }

        card.dataset.persisted = "true";
        board.insertBefore(card, addCard);
    });

    const numericIds = cardsFromExpenses
        .map(card => Number(card.id))
        .filter(Number.isFinite);
    if (numericIds.length) cashflowCardId = Math.max(cashflowCardId, ...numericIds) + 1;
}

async function handleCashflowCardClick(event, board) {
    const card = event.target.closest(".cashflow-card");
    if (!card) return;

    if (event.target.closest(".cashflow-card-delete")) {
        const hasExpenses = card.querySelector(".cashflow-expense-item");
        if (hasExpenses) {
            showDeleteCardWarning();
            return;
        }
        try {
            if (card.dataset.id) {
                await cashflowCardController.deleteCashflowCard(card.dataset.id);
                cashflowCards = cashflowCards.filter(item => String(item.id) !== card.dataset.id);
            }
            card.remove();
        } catch (_) {
            showMessage("error", "Não foi possível excluir o card porque ele possui despesas associadas.");
        }
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

async function handleCashflowCardKeydown(event) {
    if (event.key !== "Enter" || !event.target.matches(".cashflow-card-input")) return;

    const value = event.target.value.trim();
    if (!value) return;

    const card = event.target.closest(".cashflow-card");
    try {
        if (card.dataset.id) {
            await cashflowCardController.updateCashflowCard(card.dataset.id, value);
            cashflowCards = cashflowCards.map(item => String(item.id) === card.dataset.id ? { ...item, name: value } : item);
        } else {
            const created = await cashflowCardController.createCashflowCard(value);
            card.dataset.id = created.id;
            cashflowCards.push(created);
        }
        setCashflowCardName(card, value);
    } catch (_) {
        event.target.focus();
    }
}

export function initCashflow() {

    if (cashflowInitialized) return;

    const layout = document.querySelector(".cashflow-layout");
    const board = document.querySelector(".cashflow-board");
    const addButton = document.querySelector(".cashflow-add-button");

    if (!layout || !board || !addButton) return;

    bindDeleteCardWarningModal();
    document.addEventListener("cashflow:sync-cards", () => {
        syncCashflowCards(board);
    });
    cashflowCardController.getCashflowCards().then(cards => {
        cashflowCards = cards || [];
        syncCashflowCards(board);
        document.dispatchEvent(new CustomEvent("cashflow:cards-ready"));
    });

    // DRAG START
    layout.addEventListener("dragstart", (event) => {

        const expense = event.target.closest(".expense-item");
        if (!expense || expense.dataset.paid === "true") return;
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
    layout.addEventListener("drop", async (event) => {
        const target = event.target.closest(".cashflow-card, .cashflow-unpaid");
        if (!target) return;
        event.preventDefault();
        if (!draggedExpense) return;

        const expense = draggedExpense;
        draggedExpense = null;

        const isPaid = expense.dataset.paid === "true";
        if (target.classList.contains("cashflow-unpaid") && isPaid) return;

        if (target.classList.contains("cashflow-unpaid")) {
            insertUnpaidExpenseByDueDate(target, expense);
            await expensesController.updateExpenseCashflowCard(expense.dataset.id, null);
        } else {
            const cardName = target.dataset.name?.trim();
            if (!cardName) {
                target.querySelector(".cashflow-card-input")?.focus();
                return;
            }
            target.appendChild(expense);
            await expensesController.updateExpenseCashflowCard(
                expense.dataset.id,
                target.dataset.id
            );
        }
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

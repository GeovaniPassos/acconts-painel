let cashflowCardId = 1;
let cashflowInitialized = false;
let draggedCashflowContent = null;

function configureCashflowDropZone(card) {
    card.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    card.addEventListener("drop", (event) => {
        event.preventDefault();

        if (draggedCashflowContent) {
            card.appendChild(draggedCashflowContent);
            draggedCashflowContent = null;
        }
    });
}

function configureCashflowDrag(content) {
    content.addEventListener("dragstart", (event) => {
        draggedCashflowContent = event.currentTarget;
        event.dataTransfer.effectAllowed = "move";
    });

    content.addEventListener("dragend", () => {
        draggedCashflowContent = null;
    });
}

function createCashflowCard(id) {
    const card = document.createElement("div");
    card.className = "cashflow-panel cashflow-card";
    card.dataset.id = id;

    const content = document.createElement("div");
    content.className = "cashflow-card-content";
    content.draggable = true;
    content.innerHTML = `
        <div class="cashflow-card-header">
            <p style="font-size: 1.2rem;">Previsão Pgto: </p>
            <input class="cashflow-card-input" type="text" placeholder="Descrição" maxlength="40">
            <span class="cashflow-card-title" title="Clique para editar"></span>
            <span class="cashflow-card-space"></span>
            <button class="cashflow-card-delete" type="button" title="Excluir card">❌</button>
        </div>
    `;

    card.appendChild(content);
    configureCashflowDropZone(card);
    configureCashflowDrag(content);
    return card;
}

function handleCashflowCardClick(event, board) {
    const card = event.target.closest(".cashflow-card");
    if (!card) return;

    if (event.target.closest(".cashflow-card-delete")) {
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

    const board = document.querySelector(".cashflow-board");
    const addButton = document.querySelector(".cashflow-add-button");
    const dropZones = document.querySelectorAll(".cashflow-layout > .cashflow-panel");

    if (!board || !addButton) return;

    dropZones.forEach(configureCashflowDropZone);
    document
        .querySelectorAll(".cashflow-layout [draggable='true']")
        .forEach(configureCashflowDrag);

    board.addEventListener("click", (event) => handleCashflowCardClick(event, board));
    board.addEventListener("keydown", handleCashflowCardKeydown);

    addButton.addEventListener("click", () => {
        const card = createCashflowCard(cashflowCardId);
        cashflowCardId += 1;
        board.insertBefore(card, addButton.closest(".cashflow-add-card"));
    });

    cashflowInitialized = true;
}

import * as receiptsController from "../controllers/receiptController.js";
import { formatDate } from "../utils/date.js";
import { formatMoney } from "../utils/money.js";

export function renderReceiptList(receipts) {
    const ul = document.getElementById("receipt-list");
    ul.innerHTML = "";

    receipts.receipt.forEach(receipt => {
        ul.appendChild(renderReceiptItem(receipt));
    });
}

//Função para renderizar a lista de receitas
function renderReceiptItem(receipt) {
    const li = document.createElement("li");
    li.dataset.id = receipt.id; 
    li.className = "receipt-item";
    li.innerHTML = `
        <div class="info-group main">
            <strong class="receipt-name">${receipt.name}</strong>
            <span class="receipt-description">${receipt.description}</span>
        </div>
        <div class="receipt-category">
            <span>${receipt.categoryName}</span>
        </div>
        <div class="group-value-date">
            <span class="receipt-value">${formatMoney(receipt.value)}</span>
            <span class="receipt-date">${formatDate(receipt.date)}</span>
        </div>

        <div class="actions">
            <button class="btn-edit btn-icon" title="Editar">✏️</button>
            <button class="btn-delete btn-icon" title="Deletar">🗑️</button>
        </div>
    `;

    return li;
}

async function handleListClick(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);
    
    const btnDelete = event.target.closest(".btn-delete");
    if (btnDelete) {
        if (!confirm("Excluir está receita?")) return;
        receiptsController.deleteReceipt(id);
    }

    const btnEdit = event.target.closest(".btn-edit");
    if (btnEdit) {
        receiptsController.handleEditReceiptsForm(id);
    }
}

export function bindReceiptListClick() {
    document.getElementById("receipt-list").addEventListener("click", handleListClick);
}

export function bindBtnCurrentMonthReceipts() {
    document.getElementById("btn-current-month").addEventListener("click", () => {
        receiptsController.getListReceiptsCurrentMonth();
    });
}
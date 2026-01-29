export function renderExpensesList(expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    expenses.forEach( c => ul.appendChild(renderExpensesItem(c)));
}

export function renderExpensesItem(expense) {
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
            <span class="expense-value">R$ ${Number(expense.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span class="expense-date">${formatDate(expense.date)}</span>
        </div>

        <div class="info-group status">
            <span class="badge ${statusClass}">${statusText}</span>
            <span class="expense-date expense-paymentDate-${expense.id}">${formatDate(expense.paymentDate)}</span>
        </div>

        <div class="actions">
            <button class="btn-edit btn-icon" title="Editar">✏️</button>
            <button class="btn-delete btn-icon" title="Deletar">🗑️</button>
        </div>
    `;

    return li;
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

export function getDateParts(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return { year, month, day };
}

export function getTodayDate() {
    const { year, month, day } = getDateParts();
    
    return `${year}-${month}-${day}`;
}

export function getMonthFromTheCurrentPeriod() {
       return getDateParts().month;
}
export function getYearFromTheCurrentPeriod() {
    return getDateParts().year;
}

export function fillFormForEdit(expenses) {
    const form = document.getElementById("expenses-form");
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title");

    form.dataset.mode = "edit";
    form.dataset.id = expenses.id;

    form.name.value = expenses.name;
    form.value.value = expenses.value;
    form.description.value = expenses.description || "";

    if (expenses.date) {
        form.date.value = expenses.date.split("T")[0];
    }

    const categoryInput = document.getElementById('category-input');
    categoryInput.value = expenses.categoryName;
    document.getElementById('ghost-text').textContent = "";

    const statusBtn = document.getElementById("status");
    const isPaid = expenses.payment === true || expenses.payment === "true";
    toggleStatusVisual(document.getElementById("status"), isPaid);

    statusBtn.dataset.paid = isPaid;
    statusBtn.textContent = isPaid ? "Pago" : "Pendente";

    statusBtn.classList.toggle("btn-paid", isPaid);

    if (modalTitle) modalTitle.textContent = "Editar despesa";

    modal.style.display = "block";
}

export function clearForm() {
    const form = document.getElementById("expenses-form");
    form.dataset.id = "";
    form.reset();
}

export function showMessage(type, text) {
    const box = document.getElementById("messages");
    box.textContent = text;
    box.className = type;
    setTimeout(() => { 
        box.textContent = ""; 
        box.className = "";
    }, 3000);
}

export function setLoading(isLoading) {
    const loader = document.getElementById("loader");
    loader.style.display = isLoading ? "block" : "none";
}

// Botão de alterar o status do pagamento
export function toggleStatusVisual(element, isPaid) {
    if (!element) return;
    element.dataset.paid = isPaid;
    
    element.textContent = isPaid ? "Pago" : "Pendente";
    
    // Atualiza as cores
    if (isPaid) {
        element.classList.add("status-paid");
        element.classList.remove("status-pending");
    } else {
        element.classList.add("status-pending");
        element.classList.remove("status-paid");
    }
}

export function updateSummary(expenses) {
    // Calculando os valores usando reduce
    const totals = expenses.reduce((acc, expense) => {
        const value = Number(expense.value) || 0;
        const isPaid = expense.payment === true || expense.payment === "true";

        acc.total += value;
        if (isPaid) {
            acc.paid += value;
        } else {
            acc.pending += value;
        }
        
        return acc;
    }, { total: 0, paid: 0, pending: 0 });

    // Atualizando o DOM com formatação de moeda brasileira
    document.getElementById('total-geral').textContent = formatCurrency(totals.total);
    document.getElementById('total-pago').textContent = formatCurrency(totals.paid);
    document.getElementById('total-pendente').textContent = formatCurrency(totals.pending);
}

// Função auxiliar de formatação
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export function renderExpensesList(expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    expenses.forEach( c => ul.appendChild(renderExpensesItem(c)));
}

export function renderExpensesItem(expense) {
    const li = document.createElement("li");
    li.dataset.id = expense.id;
    li.className = "expense-item";
    //li.textContent = `${expenses.name} - R$ ${Number(expenses.value).toFixed(2)}`;
    const statusClass = expense.paid ? "paid-status" : "pending-status";
    const statusText = expense.paid ? "Pago" : "Pendente";

    li.innerHTML = `
        <div class="info-group main">
            <strong class="expense-name">${expense.name}</strong>
            <span class="expense-category">${expense.categoryName}</span>
        </div>

        <div class="info-group finance">
            <span class="expense-value">R$ ${Number(expense.value).toFixed(2)}</span>
            <span class="expense-date">${expense.date}</span>
        </div>

        <div class="info-group status">
            <span class="badge ${statusClass}">${statusText}</span>
        </div>

        <div class="actions">
            <button class="btn-edit btn-icon" title="Editar">✏️</button>
            <button class="btn-delete btn-icon" title="Deletar">🗑️</button>
        </div>
    `;

    li.querySelector(".btn-edit").addEventListener("click", () => handleEdit(expense.id));
    li.querySelector(".btn-delete").addEventListener("click", () => handleDelete(expense.id));

    return li;
    /*
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.className = "btn-edit";

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Deletar";
    btnDelete.className = "btn-delete";

    li.append(" ", btnEdit, " ", btnDelete);
    return li;
    */
}

export function fillFormForEdit(expenses) {
    const form = document.getElementById("expenses-form");
    form.dataset.mode = "edit";
    form.dataset.id = expenses.id;
    form.name.value = expenses.name;
    form.value.value = expenses.value;
}

export function clearForm() {
    const form = document.getElementById("expenses-form");
    form.requestFullscreen();
    form.dataset.mode = "create";
    form.dataset.id = "";
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

// Função para renderizar a lista de despesas
export function renderExpensesList(expenses) {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    expenses.forEach( c => ul.appendChild(renderExpensesItem(c)));
}

//Função para renderizar a lista de despesas
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

//Função para formatar datas
export function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

export function formatDateApi(dateStr) {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
}

//Função para retornar a data em partes
export function getDateParts(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return { year, month, day };
}

//Função para pegar a data atual e formatar a data igual vem da API
export function getTodayDate() {
    const { year, month, day } = getDateParts();
    return `${day}/${month}/${year}`;
}

// Função para pegar o mes atual
export function getMonthFromTheCurrentPeriod() {
       return getDateParts().month;
}

// Função para pegar o ano atual 
export function getYearFromTheCurrentPeriod() {
    return getDateParts().year;
}

// Função para preencher o formulário para edição
export function fillFormForEdit(expenses) {
    const form = document.getElementById("expenses-form");
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title");
    const textInstallment = document.querySelector(".installments");
    form.dataset.mode = "edit";
    form.dataset.id = expenses.id;
    const categoryInput = document.getElementById('category-input');
    categoryInput.value = expenses.categoryName;
    document.getElementById('ghost-text').textContent = "";
    
    form.name.value = expenses.name;
    document.getElementById("name").disabled = true;

    form.value.value = expenses.value;
    form.description.value = expenses.description || "";

    form.installments.value = expenses.installment;
    textInstallment.textContent = "Número da parcela";
    document.getElementById("installments").disabled = true;

    const statusBtn = document.querySelector(".btn-form-status");
    const isPaid = expenses.payment === true || expenses.payment === "true";
    toggleStatusVisual(statusBtn, isPaid);
    
    form.paymentDate.value = formatDate(expenses.paymentDate) || "";
    
    if (expenses.date) {
        form.date.value = expenses.date.split("T")[0];
    }

    if (modalTitle) modalTitle.textContent = "Editar despesa";

    modal.style.display = "block";
}

//  Função para limpar o formulário
export function clearForm() {
    const form = document.getElementById("expenses-form");
    form.dataset.id = "";
    form.reset();
    document.getElementById("name").disabled = false;
    document.getElementById("installments").disabled = false;
    document.querySelector(".modal-title").textContent = "Nova Despesa"
    document.querySelector(".installments").textContent = "Quantidade Parcelas:";
    // Reset do botão de status
    const statusBtn = document.querySelector(".btn-form-status");
    statusBtn.dataset.paid = "false";
    statusBtn.classList.add("status-pending");
    statusBtn.classList.remove("status-paid");
    statusBtn.textContent = "Pendente";
    
    // Limpa o campo de data de pagamento
    //document.querySelector(".expense-payment-date").value = "";
}

// Função para mostrar as mensagens de retorno
export function showMessage(type, text) {
    const box = document.getElementById("messages");
    box.textContent = text;
    box.className = type;
    setTimeout(() => { 
        box.textContent = ""; 
        box.className = "";
    }, 3000);
}

// Função para definir o carregamento da pagina e realizar o bloqueio dá mesma
export function setLoading(isLoading) {
    const loader = document.getElementById("loader");
    loader.style.display = isLoading ? "block" : "none";
}

// Botão de alterar o status do pagamento visualmente
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

//  Função para atualizar a resumo dos valores das despesas
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

// Função auxiliar de formatação monetária
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
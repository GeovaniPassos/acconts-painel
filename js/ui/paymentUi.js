import * as date from "../utils/date.js";

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

//Função para vincular o botão de alterar pagamento na tabela de despesas
export function bindPaymentToggleButtons(handlers) {
    const containers = [
        document.getElementById("expenses-list"),
        document.querySelector(".cashflow-layout")
    ];

    containers.forEach(container => {
        if (!container || container.dataset.paymentToggleBound === "true") return;
        container.dataset.paymentToggleBound = "true";

        container.addEventListener("click", (event) => {
            const btn = event.target.closest(".btn-table-status");
            if (!btn || !container.contains(btn)) return;

            if (handlers?.onToggle) handlers.onToggle(btn);
        });
    });
}

// Função para habilitar o evento para alterar o status dentro do formulário
export function toggleStatusPayment(){
    const statusbtnForm = document.querySelector(".btn-form-status");
    const paymentDateForm = document.querySelector(".expense-payment-date");
    statusbtnForm.addEventListener("click", () => {
        const isPaid = statusbtnForm.dataset.paid === "true";
        toggleStatusVisual(statusbtnForm, !isPaid);
        paymentDateForm.value = !isPaid ? date.getTodayDate() : "";
    });
}

export function toggleDateStatusPayment(expense) {
    const paymentDateForm = document.querySelector(`.expense-payment-date-${expense.id}`);
    paymentDateForm.textContent = expense.payment ? date.formatDate(expense.paymentDate) : "-";
}

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
    const list = document.getElementById("expenses-list");
    
    if (!list) return;

    if (list.dataset.paymentToggleBound === "true") return;
    list.dataset.paymentToggleBound = "true";

    list.addEventListener("click", (event) => {
        const btn = event.target.closest(".btn-table-status");
        if (!btn) return;

        console.log("botão clicado", btn.dataset.paid);
        if (handlers?.onToggle) handlers.onToggle(event, btn);
    });
}

// Função para habilitar o evento para alterar o status dentro do formulário
export function toggleStatusPayment(){
    const statusbtnForm = document.querySelector(".btn-form-status");
    const paymentDateForm = document.querySelector(".expense-payment-date");

    statusbtnForm.addEventListener("click", () => {
        //chamar o core para pensar o que fazer
        const isPaid = statusbtnForm.dataset.paid === "true";
        toggleStatusVisual(statusbtnForm, !isPaid);
        paymentDateForm.value = !isPaid ? getTodayDate() : "";
    });
}




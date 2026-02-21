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

export function bindPaymentToggleButtons(handlers) {
    const buttons = document.querySelectorAll(".btn-table-status");
    
    buttons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            handlers.onToggle(event, btn);
        });
    });
}
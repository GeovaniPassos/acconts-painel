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
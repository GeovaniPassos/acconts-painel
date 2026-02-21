import { showMessage } from "../ui/feedback";
import { bindPaymentToggleButtons } from "../ui/paymentUi";

export function initPayment() {
    bindPaymentToggleButtons({
        ontoggle: handleTogglePayment
    });
}

async function handleTogglePayment(event, button) {
    try {
        const li = button.closest("li");
        const expenseId = Number(li.dataset.id);
        //CONTINUAR AQUI
        const result = core.toggle
    } catch(e){
        showMessage("Error", `Falha ao carregar: ${e.message}`);
    }
}
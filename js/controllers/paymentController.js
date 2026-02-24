import { VARIABLE_CONNECTION } from "../config/config.js";

import Service from "../services/service.js";
import * as feedback from "../ui/feedback.js";
import * as ui from "../ui/paymentUi.js";

const service = new Service(VARIABLE_CONNECTION);

export function definePayment() {
    ui.bindPaymentToggleButtons({
        onToggle: handleTogglePayment
    });
}

//falta testar e terminar a função
async function handleTogglePayment(event, button) {
    try {
        const li = button.closest("li");
        const expenseId = Number(li.dataset.id);
        
        const result = core.togglePaymenetStatus(button.dataset.paid);

        const updated = await service.togglePayment(expenseId, result.isPaid);

        ui.updatePaymentVisual(button, result.isPaid);

    } catch(e){
        feedback.showMessage("Error", `Falha ao carregar: ${e.message}`);
    }
}
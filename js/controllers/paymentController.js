import { VARIABLE_CONNECTION } from "../config/config.js";

import Service from "../services/service.js";
import * as feedback from "../ui/feedback.js";
import * as ui from "../ui/paymentUi.js";
import * as core from "../core/paymentCore.js";

const service = new Service(VARIABLE_CONNECTION);

export function definePayment() {
    ui.bindPaymentToggleButtons({
        onToggle: handleTogglePayment
    });
}

//TODO: Falta ajustar a alteração na data, e se vai apenas incluir para não ter que 
//carregar toda lista
async function handleTogglePayment(event, button) {
    try {
        const li = button.closest("li");
        const expenseId = Number(li.dataset.id);
        
        const result = core.togglePaymenetStatus(button.dataset.paid);

        await service.togglePayment(expenseId, result.isPaid);

        ui.toggleStatusVisual(button, result.isPaid);
        

        
    } catch(e){
        feedback.showMessage("Error", `Falha ao carregar: ${e.message}`);
    }
}
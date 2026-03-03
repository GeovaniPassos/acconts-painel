import { VARIABLE_CONNECTION } from "../config/config.js";

import Service from "../services/service.js";
import * as feedback from "../ui/feedback.js";
import * as ui from "../ui/paymentUi.js";
import * as core from "../core/paymentCore.js";
import * as expensesController from "../controllers/expensesController.js";

const service = new Service(VARIABLE_CONNECTION);

export function definePayment() {
    ui.bindPaymentToggleButtons({
        onToggle: handleTogglePayment
    });
}

async function handleTogglePayment(button) {
    try {
        const li = button.closest("li");
        const expenseId = Number(li.dataset.id);
        
        const result = await service.togglePayment(expenseId);
        if (result) {
            expensesController.updateItemExpensesList(result);
        }
        
        ui.toggleStatusVisual(button, result.payment);
        ui.toggleDateStatusPayment(result);
        

    } catch(e){
        feedback.showMessage("Error", `Falha ao carregar: ${e.message}`);
    }
}
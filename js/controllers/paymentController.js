import { VARIABLE_CONNECTION } from "../config/config.js";

import Service from "../services/service.js";
import * as feedback from "../ui/feedback.js";
import * as ui from "../ui/paymentUi.js";
import * as expensesController from "../controllers/expensesController.js";
import { searchParams } from "./searchController.js";

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
        await service.togglePayment(expenseId);
        expensesController.getExpensesBySearch(searchParams);
        
    } catch(e){
        feedback.showMessage("Error", `Falha ao carregar: ${e.message}`);
    }
}
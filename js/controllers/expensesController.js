import { getMonthAndYearFromCurrentPeriod } from "../utils/date.js";

import Service from "../services/service.js";
import { VARIABLE_CONNECTION } from "../config/config.js";
import { setLoading, showMessage } from "../ui/feedback.js";
import { renderExpensesList } from "../ui/expensesUi.js";
import { updateSummary } from "../ui/sumary.js";

const service = new Service(VARIABLE_CONNECTION);

export function initExpensesTable() {
    renderExpenseListForMouth();
}

export async function renderExpenseListForMouth() {
    try {
        setLoading(true);
        const list = await getListExpensesForMonth();
        renderExpensesList(list);
        updateSummary(list);
    } catch (e) {
        showMessage("error", `Falha ao carregar: ${e.message}`);
    } finally {
        setLoading(false);
    }
}

export async function getListExpensesForMonth(){
    const currentDate = getMonthAndYearFromCurrentPeriod();
    const expensesList = await service.getExpensesByMonth(currentDate.yearCurrent, currentDate.monthCurrent);
    
    return expensesList;
}
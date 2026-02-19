import { getMonthAndYearFromCurrentPeriod } from "../utils/date.js";

import Service from "../services/service.js";
import { VARIABLE_CONNECTION } from "../config/config.js";

const service = new Service();

export default class expensesController {

    service = new Service(VARIABLE_CONNECTION);

    async getListExpensesForMonth(){
        const currentDate = getMonthAndYearFromCurrentPeriod();
        const expensesList = await service.getExpensesByMonth(currentDate);

        return expensesList;
    }
}
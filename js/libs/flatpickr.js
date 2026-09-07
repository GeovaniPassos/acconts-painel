import * as searchController from "../controllers/searchController.js";
import * as expensesController from "../controllers/expensesController.js";

export function initFlatpickr() {
    const element = document.getElementById("date-range");

    flatpickr(element, {
        mode: "range",
        locale: "pt",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        onClose: async function(selectedDates) {
            if (selectedDates.length === 2) {
                const startDate = formatLocalDate(selectedDates[0]);
                const endDate = formatLocalDate(selectedDates[1]);

                searchController.searchParams.startDate = startDate;
                searchController.searchParams.endDate = endDate;
                await expensesController.getExpensesBySearch(searchController.searchParams);

            } else if (selectedDates.length === 0) {

                searchController.searchParams.startDate = "";
                searchController.searchParams.endDate = "";
                if (searchController.searchParams.name || searchController.searchParams.months?.length) {
                    await expensesController.getExpensesBySearch(searchController.searchParams);
                } else {
                    await expensesController.getListExpensesCurrentMonth();
                }

            }
        }
    });
}

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

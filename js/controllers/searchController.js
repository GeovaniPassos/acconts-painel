import * as controllerExpenses from './expensesController.js';

import * as feedback from '../ui/feedback.js';

export let searchParams = {
    startDate: "",
    endDate: "",
    name: "",
    months: [],
    paymentStatus: "all",
    sortBy: "createdAt"
};

export function initNameSearch() {
    const searchName = document.getElementById("searchName");
    const btnsearch = document.getElementById("btn-searchName");
    const dateRange = document.getElementById("date-range");
    const monthFilters = document.querySelectorAll('input[name="expense-month"]');
    const paymentFilter = document.getElementById("payment-filter");
    keyEnterSearch();

    const applyFilters = async () => {

        try {
            feedback.setLoading(true);
            searchParams.months = [...monthFilters]
                .filter(month => month.checked)
                .map(month => month.value);
            searchParams.paymentStatus = paymentFilter.value || "all";

            if (!dateRange.value && !searchName.value.trim() && !searchParams.months.length && searchParams.paymentStatus === "all") {
                return feedback.showMessage("info", "Por favor, preencha pelo menos um campo de busca.");
            }

            if (!dateRange.value) {
            searchParams.startDate = "";
            searchParams.endDate = "";
            }

            searchParams.name = searchName.value.trim();
            await controllerExpenses.getExpensesBySearch(searchParams);

        } catch (e) {
            feedback.showMessage("error", `Falha ao carregar`);
        } finally {
            feedback.setLoading(false);
        }

    };

    btnsearch.addEventListener('click', applyFilters);
    monthFilters.forEach(month => month.addEventListener("change", applyFilters));

    document.querySelectorAll(".expense-sort-button").forEach(button => {
        button.addEventListener("click", async () => {
            searchParams.sortBy = button.dataset.sort;
            document.querySelectorAll(".expense-sort-button").forEach(sortButton => {
                const isActive = sortButton === button;
                sortButton.classList.toggle("is-active", isActive);
                sortButton.setAttribute("aria-pressed", String(isActive));
            });
            await controllerExpenses.getExpensesBySearch(searchParams);
        });
    });

}

export function keyEnterSearch() {
    document.getElementById("searchName")
        .addEventListener('keydown', function(UIEvent) {
            if (UIEvent.key == 'Enter') {
                document.getElementById("btn-searchName").click();
            }
        });
}



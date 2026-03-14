import * as controllerExpenses from './expensesController.js';

export let searchParams = {
    startDate: "",
    endDate: "",
    name: ""
};

export function initNameSearch() {
    const searchName = document.getElementById("searchName");
    const btnsearch = document.getElementById("btn-searchName");
    keyEnterSearch();

    btnsearch.addEventListener('click', async () => {
        const dateRange = document.getElementById("date-range");

        if (!dateRange.value) {
            searchParams.startDate = "";
            searchParams.endDate = "";
        }

        searchParams.name = searchName.value;
        controllerExpenses.getExpensesBySearch(searchParams);

        searchName.value = "";
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

import * as controllerExpenses from './expensesController.js';

//     expenseData = await service.getExpensesByName(name);
//     renderExpensesList(expenseData);
//     updateSummary(expenseData);
// });

export function initNameSearch() {
    const searchName = document.getElementById("searchName");
    const btnsearchName = document.getElementById("btn-searchName");
    keyEnterSearch();

    btnsearchName.addEventListener('click', async () => {
        controllerExpenses.getExpensesByName(searchName.value);
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

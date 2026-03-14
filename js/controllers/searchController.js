import * as controllerExpenses from './expensesController.js';
import * as feedback from '../ui/feedback.js';

export let searchParams = {
    startDate: "",
    endDate: "",
    name: ""
};

export function initNameSearch() {
    const searchName = document.getElementById("searchName");
    const btnsearch = document.getElementById("btn-searchName");
    const dateRange = document.getElementById("date-range");
    keyEnterSearch();

    btnsearch.addEventListener('click', async () => {

        try {
            feedback.setLoading(true);
            if (!dateRange.value && !searchName.value.trim()) {
                return feedback.showMessage("info", "Por favor, preencha pelo menos um campo de busca.");
            }

            if (!dateRange.value) {
            searchParams.startDate = "";
            searchParams.endDate = "";
            }

            searchParams.name = searchName.value;
            controllerExpenses.getExpensesBySearch(searchParams);

        } catch (e) {
            feedback.showMessage("error", `Falha ao carregar`);
        } finally {
            feedback.setLoading(false);
        }

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







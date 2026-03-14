import * as searchController from "../controllers/searchController.js";

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
                const startDate = selectedDates[0].toISOString().split('T')[0];
                const endDate = selectedDates[1].toISOString().split('T')[0];

                searchController.searchParams.startDate = startDate;
                searchController.searchParams.endDate = endDate;

            } else if (selectedDates.length === 0) {

                searchController.searchParams.startDate = "";
                searchController.searchParams.endDate = "";

            }
        }
    });
}
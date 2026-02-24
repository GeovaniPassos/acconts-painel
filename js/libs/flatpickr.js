function initFlatpickr() {
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
                // const retorno = await service.getExpensesByPeriod(startDate, endDate);
                // renderExpensesList(retorno);
                return { startDate, endDate };
            }
        }
    });
}

//TODO: ajustar a exibição do modal
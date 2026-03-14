import { initCategoryAutoComplete } from "./ui/categoriesUi.js";

import { initExpenses } from "./controllers/expensesController.js";
import { bindModal } from "./ui/modal.js";
import { releaseLocalstorage } from "./utils/localstoregeTests.js";
import { definePayment } from "./controllers/paymentController.js";
import { initFlatpickr } from "./libs/flatpickr.js";
import { toggleStatusPayment } from "./ui/paymentUi.js";
import { bindFormSubmit } from "./ui/formUi.js";
import { bindBtnCurrentMonth, bindExpensesListClick } from "./ui/expensesUi.js";
import { initNameSearch } from "./controllers/searchController.js";

document.addEventListener("DOMContentLoaded", () => {
    initExpenses();
    bindModal();
    releaseLocalstorage();
    definePayment();
    initFlatpickr();
    toggleStatusPayment();
    bindFormSubmit();
    bindExpensesListClick();
    initCategoryAutoComplete();
    initNameSearch();
    bindBtnCurrentMonth();
});
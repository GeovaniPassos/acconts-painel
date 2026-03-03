import { findCategories, initCategoryAutoComplete } from "./ui/categoriesUi.js";

import { formatDate } from "./utils/date.js";

import { updateSummary } from "./ui/sumary.js";
import { showMessage, setLoading } from "./ui/feedback.js";
import { initExpenses } from "./controllers/expensesController.js";
import { bindModal } from "./ui/modal.js";
import { releaseLocalstorage } from "./utils/localstoregeTests.js";
import { definePayment } from "./controllers/paymentController.js";
import { initFlatpickr } from "./libs/flatpickr.js";
import { toggleStatusPayment } from "./ui/paymentUi.js";
import { bindFormSubmit } from "./ui/formUi.js";
import { bindExpensesListClick } from "./ui/expensesUi.js";
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
});
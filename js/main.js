import { initCategoryAutoComplete } from "./ui/categoriesUi.js";

import { initExpenses } from "./controllers/expensesController.js";
import { bindModal } from "./ui/modal.js";
import { releaseLocalstorage } from "./utils/localstoregeTests.js";
import { definePayment } from "./controllers/paymentController.js";
import { initFlatpickr } from "./libs/flatpickr.js";
import { toggleStatusPayment } from "./ui/paymentUi.js";
import { bindFormSubmit } from "./ui/formUi.js";
import { bindBtnCurrentMonthExpenses, bindExpensesListClick } from "./ui/expensesUi.js";
import { initNameSearch } from "./controllers/searchController.js";
import { checkAuthentication, logout } from "./ui/mainUi.js";
import { initTables } from "./ui/tablesUi.js";
import { initReceipt } from "./controllers/receiptController.js";
import { bindBtnCurrentMonthReceipts, bindReceiptListClick } from "./ui/receiptUi.js";

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
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
    bindBtnCurrentMonthExpenses();
    bindBtnCurrentMonthReceipts();
    logout();
    initTables();
    initReceipt();

    bindReceiptListClick();
});
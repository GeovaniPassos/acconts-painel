import ApiService from "./apiService.js";
import LocalStorageService from "./localStoregeService.js";

export default class Service {
    constructor(stragegy = "api") {
        this.stragegy = stragegy === "api" ? new ApiService() : new LocalStorageService();
    }
    //Expenses
    getExpenses() {
        return this.stragegy.getExpenses();
    }

    getExpensesById(id){
        return this.stragegy.getExpensesById(id);
    }

    createExpenses(data) {
        return this.stragegy.createExpenses(data);
    }

    updateExpenses(id, data){
        return this.stragegy.updateExpenses(id, data);
    }

    deleteExpenses(id) {
        return this.stragegy.deleteExpenses(id);
    }

    getExpensesByPeriod(startDate, endDate) {
        return this.stragegy.getExpensesByPeriod(startDate, endDate);
    }

    getExpensesByMonth(year, month) {
        return this.stragegy.getExpensesByMonth(year, month);
    }

    //Categories
    getCategory() {
        return this.stragegy.getCategory();
    }

    createCategory(data){
        return this.stragegy.createCategory(data);
    }

    getCategoryById(id) {
        return this.stragegy.getCategoryById(id);
    }

    updateCategory(id, data) {
        return this.stragegy.updateCategory(id, data);
    }

    deleteCategory(id) {
        return this.stragegy.deleteCategory(id);
    }
}
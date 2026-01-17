import { expenses } from "../data/data.js";

export default class LocalStorageService {
    
    //Expenses
    async getExpenses() {
        return expenses;
    }    
    
    async getExpensesById(id){
        expenses.forEach((expense) => {
            if (expense.id == id) {
                return expense.id;
            } 
        });
    }

    async createExpenses(data) {
        return localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    async updateExpenses(id, data){
        //return this.stragegy.updateExpenses(id, data);
    }

    async deleteExpenses(id) {
        //return this.stragegy.deleteExpense(id);
    }

    //Categories
    async getCategory() {
        //return this.stragegy.getCategory();
    }

    async createCategory(data){
        //return this.stragegy.createCategory(data);
    }

    async getCategoryById(id) {
        //return this.stragegy.getCategoryById(id);
    }

    async updateCategory(id, data) {
        //return this.stragegy.updateCategory(id, data);
    }

    async deleteCategory(id) {
        //return this.stragegy.deleteCategory(id);
    }
    
}
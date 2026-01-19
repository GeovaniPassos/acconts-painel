import { categories } from "../data/category.js";
import { expenses } from "../data/expenses.js";

export default class LocalStorageService {
    constructor() {
        if (!localStorage.getItem("categories")) {
            localStorage.setItem("categories", JSON.stringify(categories));
        }

        if (!localStorage.getItem("expenses")) {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }
    }
    
    //Expenses
    async getExpenses() {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        return expenses.map(exp => {
            const category = categories.find(cat => cat.id === exp.category);
            return {
                ...exp,
                categoryName: category ? category.name: null,
            };
        });
    }    
    
    //TODO: Ajustar o metodo para salvar o id, 
    // salvando com string não é localizado em fezer alterações
    async getExpensesById(id){
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const expense = expenses.find(exp =>  exp.id === id);
        if (!expense) return null;
        const category = categories.find(cat => cat.id === expense.category);
            return {
                ...expense,
                categoryName: category ? category.name: null,
                
            };
        
    }   
    

    async createExpenses(data) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        const nextId = expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
        
        const newExpense = { ... data, id: nextId};

        expenses.push(newExpense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        return newExpense;
    }   

    async updateExpenses(id, data){
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        
        const index = expenses.findIndex(exp => exp.id === id);
        if (index === -1) {
            throw new Error("Categoria não encontrada!");
        }

        expenses[index] = { ...expenses[index], ...data, id};

        localStorage.setItem("expenses", JSON.stringify(expenses));
        
        return expenses[index];
    }

    async deleteExpenses(id) {
        //return this.stragegy.deleteExpense(id);
    }

    //Categories
    async getCategory() {
        return JSON.parse(localStorage.getItem("categories")) || [];
    }

    async createCategory(data){
        const categories = JSON.parse(localStorage.getItem("categories")) || [];

        const nextId = categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) + 1 : 1;
        
        const newCategory = { ... data, id: nextId};

        categories.push(newCategory);
        localStorage.setItem("categories", JSON.stringify(categories));

        return newCategory;
    }

    async getCategoryById(id) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        const category = categories.find(cat =>  cat.id === id);
        if (!category) return null;
        
        return {
            ...category,
            categoryName: category ? category.name: null,
        };
    }

    async updateCategory(id, data) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];

        const index = categories.findIndex(exp => exp.id === id);
        if (index === -1) {
            throw new Error("Categoria não encontrada!");
        }

        categories[index] = { ...categories[index], ...data, id};

        localStorage.setItem("categories", JSON.stringify(categories));
        
        return categories[index];
    }

    async deleteCategory(id) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        

    }
    
}
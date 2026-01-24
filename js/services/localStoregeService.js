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
        const categories = JSON.parse(localStorage.getItem("categories"));
        return expenses.map(exp => {
            const category = categories.find(cat => cat.id === exp.category);
            return {
                ...exp,
                categoryName: category ? category.name: null,
            };
        });
    }    
    
    async getExpensesById(id){
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));
        const expense = expenses.find(exp =>  exp.id === Number(id));

        if (!expense) return null;
        const category = categories.find(cat => cat.id === expense.category);
            return {
                ...expense,
                categoryName: category ? category.name: null,
            };
    }   

    async createExpenses(data) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));

        const category = categories.find(cat =>  cat.name.toLowerCase() == data.categoryName.toLowerCase());

        const nextId = expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
        
        const newExpense = { ... data, id: nextId, category: category.id};
        
        expenses.push(newExpense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        return newExpense;
    }   

    async updateExpenses(id, data){
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));

        let category = categories.find(cat =>  cat.name.toLowerCase() == data.categoryName.toLowerCase());
        
        const index = expenses.findIndex(exp => exp.id === Number(id));
        if (index === -1) {
            throw new Error("Categoria não encontrada!");
        }
        category = Number(category.id);
        id = Number(id);
        expenses[index] = { ...expenses[index], ...data, id, category};

        localStorage.setItem("expenses", JSON.stringify(expenses));
        
        return expenses[index];
    }

    async deleteExpenses(id) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        const newExpenseArray = expenses.filter(exp => exp.id !== Number(id));

        localStorage.setItem("expenses", JSON.stringify(newExpenseArray));

    }

    //Categories
    async getCategory() {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        return categories;
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
        const category = categories.find(cat =>  cat.id === Number(id));
        if (!category) return null;
        
        return {
            ...category,
            categoryName: category ? category.name: null,
        };
    }

    async updateCategory(id, data) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];

        const index = categories.findIndex(cat => cat.id === Number(id));
        if (index === -1) {
            throw new Error("Categoria não encontrada!");
        }

        categories[index] = { ...categories[index], id, ...data};

        localStorage.setItem("categories", JSON.stringify(categories));
        
        return categories[index];
    }

    async deleteCategory(id) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        
        const newCategoryArray = categories.filter(cat => cat.id !== Number(id));

        localStorage.setItem("categories", JSON.stringify(newCategoryArray));

    }

    async getExpensesByPeriod(startDate, endDate) {
        const expenses = await this.getExpenses();

        return expenses.filter(expense => {
            if (!expense.date) return false;

            return expense.date >= startDate &&
                expense.date <= endDate;
        });
    }

    async getExpensesByMonth(year, month) {
        const expenses = await this.getExpenses();

        const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

        return expenses.filter(expense => {
            return expense.date.substring(0, 7) === yearMonth;
        });
    }

    async getExpensesByName(name) {
        const expenses = await this.getExpenses();

        if (!name || !name.trim()) return expenses;

        const search = name.toLowerCase().trim();
        
        return expenses.filter(expense => {
            return expense.name?.toLowerCase().includes(search);
            //console.log(expense.name.toLowerCase().includes(search))
        });
    }
}
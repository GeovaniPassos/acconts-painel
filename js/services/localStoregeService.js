import { categories } from "../data/category.js";
import { expenses } from "../data/expenses.js";
import * as date from "../utils/date.js";

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
    async getExpenses(startDate = "", endDate = "", name = "") {
        const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));
        
        let expenses = allExpenses.map(exp => {
            const category = categories.find(cat => cat.id === exp.category);
            return {
                ...exp,
                categoryName: category ? category.name: null,
            };
        });

        // Aplicar filtros
        if (startDate && endDate) {
            expenses = expenses.filter(expense => {
                return expense.date >= startDate && expense.date <= endDate;
            });
        }

        if (name && name.trim()) {
            const search = name.toLowerCase().trim();
            expenses = expenses.filter(expense => {
                return expense.name?.toLowerCase().includes(search);
            });
        }

        // Calcular totais
        const totalPaid = expenses.filter(exp => exp.payment).reduce((sum, exp) => sum + Number(exp.value || 0), 0);
        const totalUnpaid = expenses.filter(exp => !exp.payment).reduce((sum, exp) => sum + Number(exp.value || 0), 0);
        const total = totalPaid + totalUnpaid;

        return {
            expenses: expenses,
            total: total,
            totalPaid: totalPaid,
            totalUnpaid: totalUnpaid
        };
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
        const category = categories.find(cat => cat.name.toLowerCase() === data.categoryName.toLowerCase());
        
        if (!category) {
            throw new Error("Categoria não encontrada!");
        }

        const nextId = expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
        const totInstallments = data.totalInstallments;
        const dateRef = new Date(data.date);
        const desiredDate = dateRef.getUTCDate();
        
        const createdExpenses = [];
        
        for(let i = 1; i <= totInstallments; i++) {
            let dateInstallment = new Date(dateRef);
            dateInstallment.setUTCMonth(dateRef.getUTCMonth() + i - 1);

            if (dateInstallment.getUTCDate() !== desiredDate) {
                dateInstallment.setUTCDate(0);
            }

            const formattedDate = dateInstallment.toISOString().split('T')[0];

            const paymentDate = (data.payment === "true" && data.paymentDate === "") 
                ? date.formatDateCalendar(date.getTodayDate())
                : data.paymentDate;

            const newExpense = { 
                ...data, 
                id: nextId + i - 1, 
                category: category.id, 
                installment: i, 
                date: formattedDate,
                paymentDate: paymentDate
            };
        
            expenses.push(newExpense);
            createdExpenses.push(newExpense);
        }
        
        localStorage.setItem("expenses", JSON.stringify(expenses));
        return createdExpenses;
    }

    async updateExpenses(id, data) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));

        let category = categories.find(cat => cat.name.toLowerCase() == data.categoryName.toLowerCase());
        
        const index = expenses.findIndex(exp => exp.id === Number(id));
        if (index === -1) {
            throw new Error("Categoria não encontrada!");
        }
        
        // Adiciona data atual se pagamento for true e data estiver vazia
        if (data.payment === "true" && data.paymentDate == "") {
            data.paymentDate = date.formatDateCalendar(date.getTodayDate());
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

    async togglePayment(id) {
        const expenses = JSON.parse(localStorage.getItem("expenses"));
        const categories = JSON.parse(localStorage.getItem("categories"));
        const index = expenses.findIndex(exp => exp.id === Number(id));
        
        
        if (index === -1) {
            throw new Error("Despesa não encontrada!");
        }

        const newPayment = !expenses[index].payment;
        expenses[index] = { 
            ...expenses[index], 
            payment: newPayment, 
            paymentDate: newPayment ? date.formatDateCalendar(date.getTodayDate()) : ""
        };
        localStorage.setItem("expenses", JSON.stringify(expenses));

        const category = categories.find(cat => cat.id === expenses[index].category);
            return {
                ...expenses[index],
                categoryName: category ? category.name: null,
            };
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

    //Receipts
    async getReceipts(startDate = "", endDate = "", name = "") {
        const allReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));
        
        let receipts = allReceipts.map(rec => {
            const category = categories.find(cat => cat.id === rec.category);
            return {
                ...rec,
                categoryName: category ? category.name: null,
            };
        });

        // Aplicar filtros
        if (startDate && endDate) {
            receipts = receipts.filter(receipt => {
                return receipt.date >= startDate && receipt.date <= endDate;
            });
        }

        if (name && name.trim()) {
            const search = name.toLowerCase().trim();
            receipts = receipts.filter(receipt => {
                return receipt.name?.toLowerCase().includes(search);
            });
        }

        // Calcular total
        const total = receipts.reduce((sum, rec) => sum + Number(rec.value || 0), 0);

        return {
            receipt: receipts,
            total: total
        };
    }

    async getReceiptById(id) {
        const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));
        const receipt = receipts.find(rec => rec.id === Number(id));

        if (!receipt) return null;
        const category = categories.find(cat => cat.id === receipt.category);
        return {
            ...receipt,
            categoryName: category ? category.name: null,
        };
    }

    async createReceipts(data) {
        const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));
        const category = categories.find(cat => cat.name.toLowerCase() === data.categoryName.toLowerCase());
        
        if (!category) {
            throw new Error("Categoria não encontrada!");
        }

        const nextId = receipts.length > 0 ? Math.max(...receipts.map(rec => rec.id)) + 1 : 1;
        
        const newReceipt = { 
            ...data, 
            id: nextId, 
            category: category.id 
        };
        
        receipts.push(newReceipt);
        localStorage.setItem("receipts", JSON.stringify(receipts));
        return newReceipt;
    }

    async updateReceipts(id, data) {
        const receipts = JSON.parse(localStorage.getItem("receipts")) || [];
        const categories = JSON.parse(localStorage.getItem("categories"));

        let category = categories.find(cat => cat.name.toLowerCase() === data.categoryName.toLowerCase());
        
        const index = receipts.findIndex(rec => rec.id === Number(id));
        if (index === -1) {
            throw new Error("Receita não encontrada!");
        }

        category = Number(category.id);
        id = Number(id);
        receipts[index] = { ...receipts[index], ...data, id, category};

        localStorage.setItem("receipts", JSON.stringify(receipts));
        
        return receipts[index];
    }

    async deleteReceipts(id) {
        const receipts = JSON.parse(localStorage.getItem("receipts")) || [];

        const newReceiptArray = receipts.filter(rec => rec.id !== Number(id));

        localStorage.setItem("receipts", JSON.stringify(newReceiptArray));
    }

    async login(email, password) {
        // Mock login para localStorage
        // Em produção, isso seria implementado com uma API real
        const userData = {
            email: email,
            token: `token_${Date.now()}`,
            authenticated: true
        };
        localStorage.setItem("token", userData.token);
        return userData;
    }

    async getCategoryByName(categoryName) {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        return categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    }
}
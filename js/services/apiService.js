const API_BASE = "http://localhost:8080";
//const API_BASE = "https://acconts-api.onrender.com"

export default class ApiService {
    async request(path, options = {}) {
        const resp = await fetch(`${API_BASE}${path}`, {
            headers: {"Content-Type": "application/json" },
            ...options
        });
        if (!resp.ok) {
            const message = await resp.text().catch(() => "");
            throw new Error(message || `Erro ${resp.status}`);
        }

        // Para respostas sem corpo
        const contentType = resp.headers.get("content-type") || "";
        return contentType.includes("application/json") ? resp.json() : null;
    }

    //Metodos para acessar as despesas
    async getExpenses() {
        return this.request("/expenses", { method: "GET" });
    }

    async getExpensesById(id) {
        return this.request(`/expenses/${id}`, { method: "GET" });
    }

    async createExpenses(data) {
        return this.request("/expenses", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    async updateExpenses(id, data) {
        return this.request(`/expenses/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    }

    async deleteExpenses(id) {
        return this.request(`/expenses/${id}`, { method: "DELETE" });
    }

    async getExpensesByPeriod(startDate, endDate) {
        return this.request(`/expenses/by-period?startDate=${startDate}&endDate=${endDate}`, { method: "GET" });
    }

    async getExpensesByMonth(year, month) {
        return this.request(`/expenses/by-month?year=${year}&month=${month}`, { method: "GET" });
    }

    async getExpensesByName(name) {
        return this.request(`/expenses/search?name=${name}`);
    }

    //Metodos para acessar as categorias
    async getCategory() {
        return this.request("/categories", { method: "GET" });
    }

    async createCategory(data) {
        return this.request("/categories", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    async getCategoryById(id) {
        return this.request(`/categories/${id}`, { method: "GET" });
    }

    async updateCategory(id, data) {
        return this.request(`/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, { method: "DELETE" });
}
}
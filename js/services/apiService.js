const API_BASE = "http://localhost:8080";
//const API_BASE = "https://acconts-api.onrender.com"

export default class ApiService {
    async request(path, options = {}) {
        const resp = await fetch(`${API_BASE}${path}`, {
            headers: {"Content-Type": "application/json" },
            ...options
        });

        if (!resp.ok) {
            let errorMessage = `Erro ${resp.status}`;

            try {
                const errBody = await resp.json();
                if (errBody?.message) errorMessage = errBody.message;
            } catch (_) {}

            throw new Error(errorMessage);
        }

        // Para respostas sem corpo
        const contentType = resp.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return null;

        const response = await resp.json();

        if (response.success === false) {
            throw new Error(response.message || "Error na operação");
        }

        return response.data;
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

    async addInstallments(data) {
        return this.request("/expenses/addInstallments" , {
            method: "POST",
            body: JSON.stringify(data)
        })
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

    async getExpensesByName(expenseName) {
        return this.request(`/expenses/search?name=${expenseName}`, { method: "GET" });
    }

    async togglePayment(id) {
        return this.request(`/expenses/${id}/toggle-payment`, { method: "PATCH" });
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
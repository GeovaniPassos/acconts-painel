const isLocalEnvironment = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = isLocalEnvironment
    ? "http://localhost:8080"
    : "https://acconts-api-28o5.onrender.com";

export default class ApiService {
    async request(path, options = {}) {
        const token = localStorage.getItem("token");

        const resp = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
                ...(options.headers || {})
             }
        });

        if (!resp.ok) {
            let errorMessage = `Erro: ${resp.status}`;

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

        return response.data ?? response;
    }

    //Login
    async login(username, password) {
        const data = await this.request(`/auth/login`, {
            method: "POST",
            body: JSON.stringify({ username, password })
        });

        if (!data?.token) throw new Error("A API não retornou um token de autenticação.");
        localStorage.setItem("token", data.token);
        window.location.replace("./main.html");
    }

    //Metodos para acessar as despesas
    async getExpenses(startDate, endDate, name) {
        const query = new URLSearchParams();
        if (startDate) query.set("startDate", startDate);
        if (endDate) query.set("endDate", endDate);
        if (name) query.set("name", name);
        const path = query.size ? `/expenses?${query.toString()}` : "/expenses";
        return this.request(path,
            { method: "GET" });
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

    async togglePayment(id) {
        return this.request(`/expenses/${id}/toggle-payment`, { method: "PATCH" });
    }

    async updateExpenseCashflowCard(id, cashflowCardId) {
        return this.request(`/expenses/${id}/cashflow-card`, {
            method: "PATCH",
            body: JSON.stringify({ cashflowCardId })
        });
    }

    async getCashflowCards() { return this.request("/cashflow-cards", { method: "GET" }); }
    async createCashflowCard(name) {
        return this.request("/cashflow-cards", { method: "POST", body: JSON.stringify({ name }) });
    }
    async updateCashflowCard(id, name) {
        return this.request(`/cashflow-cards/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
    }
    async deleteCashflowCard(id) { return this.request(`/cashflow-cards/${id}`, { method: "DELETE" }); }

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

    async getCategoryByName(categoryName) {
        return this.request(`/categories/search?name=${categoryName}`,
             { method: "GET" });
    }

    //Receipt
    async getReceipts(startDate, endDate, name) {
        return this.request(`/receipt?startDate=${startDate}&endDate=${endDate}&name=${name}`, 
            { method: "GET" });
    }

    async createReceipts(data) {
        return this.request("/receipt", {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    async updateReceipts(id, data) {
        return this.request(`/receipt/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    }

    async deleteReceipts(id) {
        return this.request(`/receipt/${id}`, { method: "DELETE" });
    }

    async getReceiptById(id) {
        return this.request(`/receipt/${id}`, { method: "GET" });
    }
}

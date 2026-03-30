//const API_BASE = "http://localhost:8080";
const API_BASE = "https://acconts-api-28o5.onrender.com"

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
            if (resp.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
            
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

        localStorage.setItem("token", data.token);

        window.location.href = "main.html";
    }

    //Metodos para acessar as despesas
    async getExpenses(startDate, endDate, name) {
        return this.request(`/expenses?startDate=${startDate}&endDate=${endDate}&name=${name}`, 
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
}

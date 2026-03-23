const API_BASE = "http://localhost:8080";
//const API_BASE = "https://acconts-api.onrender.com"

export default class ApiService {
    async request(path, options = {}) {
        debugger;
        const token = localStorage.getItem("token");

        const resp = await fetch(`${API_BASE}${path}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
             },
            ...options
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

        if (response.success === false) {
            throw new Error(response.message || "Error na operação");
        }

        return response.data;
    }

    //Login
    async login(username, password) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Usuário ou senha inválidos");
        }

        const data = await response.json();

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
}
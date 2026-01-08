const API_BASE = "http://localhost:8080";

async function request(path, options = {}) {
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
export async function getExpenses() {
    return request("/expenses", { method: "GET" });
}

export async function getExpensesById(id) {
    return request(`/expenses/${id}`, { method: "GET" });
}

export async function createExpenses(data) {
    return request("/expenses", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function updateExpenses(id, data) {
    return request(`/expenses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export async function deleteExpenses(id) {
    return request(`/expenses/${id}`, { method: "DELETE" });
}

//Metodos para acessar as categorias
export async function getCategory() {
    return request("/categories", { method: "GET" });
}

export async function createCategory(data) {
    return request("/categories", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getCategoryById(id) {
     return request(`/categories/${id}`, { method: "GET" });
}

export async function updateCategory(id, data) {
    return request(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export async function deleteCategory(id) {
    return request(`/categories/${id}`, { method: "DELETE" });
}
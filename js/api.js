export async function listarDespesas() {
    const response = await fetch('http://localhost:8080/expenses');
    return await response.json();
}

export async function listarCategorias() {
    const response = await fetch('http://localhost:8080/expenses');
    return await response.json();
}
// Função para mostrar as mensagens de retorno
export function showMessage(type, text) {
    const box = document.getElementById("messages");
    box.textContent = text;
    box.className = type;
    setTimeout(() => { 
        box.textContent = ""; 
        box.className = "";
    }, 3000);
}

export function setLoading(isLoading) {
    const loader = document.getElementById("loader");
    loader.style.display = isLoading ? "block" : "none";
}
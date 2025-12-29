
async function listarDespesas() {
    const response = await fetch('http://localhost:8080/expenses');
    return await response.json();
}

async function listarCategorias() {
    const response = await fetch('http://localhost:8080/expenses');
    return await response.json();
}


listarDespesas().then(debitos => {
    debitos.forEach(element => {
        
        const tabela = document.getElementById("tabela-despesas").querySelector("tbody");
        const novaLinha = tabela.insertRow();

        novaLinha.innerHTML = `
          <td>${element.categoryName}</td>
          <td>${element.name}</td>
          <td>${parseFloat(element.value).toFixed(2)}</td>
  `;
        // Limpar formulário
        document.getElementById("form-despesa").reset();

      });
});


const btnAbrir = document.getElementById("btn-abrir-form");
const btnFechar = document.getElementById("btn-fechar");
const modal = document.getElementById("modal");
const form = document.getElementById("form-despesa");
const tabela = document.getElementById("tabela-despesas").querySelector("tbody");

// Abrir modal
btnAbrir.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fechar modal
btnFechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fechar clicando fora do modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


// Salvar despesa
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value;
  const valor = document.getElementById("valor").value;

  const novaLinha = tabela.insertRow();
  novaLinha.innerHTML = `
    <td>${categoria}</td>
    <td>${descricao}</td>
    <td>${parseFloat(valor).toFixed(2)}</td>
  `;

  // Limpar e fechar modal
  form.reset();
  modal.style.display = "none";
});

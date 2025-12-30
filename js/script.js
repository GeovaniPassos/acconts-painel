//import { listarDespesas, listarCategorias } from './api.js';
import { despesas } from './data/despesas.js';
import formatCurrency from './utils/money.js';

let total = 0;

despesas.forEach(despesa => {
      
    const tabela = document.getElementById("tabela-despesas").querySelector("tbody");
    const novaLinha = tabela.insertRow();

    const valor = formatCurrency(despesa.value);

    novaLinha.innerHTML = `
      <td>${despesa.category.name}</br><p>${despesa.description}</p></td>
      <td>${despesa.name}</td>
      <td>${valor}</td>
      <td>${despesa.date}</td>
      <td>${despesa.payment}</td>
`;
    total += valor;

    document.querySelector('.total-despesas').innerHTML = `Total: ${parseFloat(total).toFixed(2)}`

    // Limpar formulário
    document.getElementById("form-despesa").reset();

    console.log(novaLinha, total);
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

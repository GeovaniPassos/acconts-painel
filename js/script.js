import { createCategory, createExpenses, getCategory, getExpenses, getExpensesById } from './api.js';
import { despesas } from './data/despesas.js';
import formatCurrency from './utils/money.js';


//console.log(getExpensesById(10));

const categoria = {
  "name": "Veiculo",
  "type": "EXPENSES"
}

//createCategory(categoria);
console.log(getCategory());

const despesa = {
  "name": "Carro",
  "description": "",
  "categoryName": "Veiculo",
  "payment": false,
  "value": 135.35,
  "date": "2025-12-18T02:36:01.643Z"
}

//createExpenses(despesa);

console.log(getExpenses());



/*
let total = 0;
let despesa = {};

despesas.forEach(despesa => {
      
    const tabela = document.getElementById("tabela-despesas").querySelector("tbody");
    const novaLinha = tabela.insertRow();

    novaLinha.innerHTML = `
      <td>${despesa.category.name}</br><p>${despesa.description}</p></td>
      <td>${despesa.name}</td>
      <td>${formatCurrency(despesa.value)}</td>
      <td>${despesa.date}</td>
      <td>${despesa.payment}</td>
`;  
    let valores = 0;
    valores += despesa.value;
    calcularTotal(valores);
    

    // Limpar formulário
    document.getElementById("form-despesa").reset();

});

function calcularTotal(valores){
  total += valores
  document.querySelector('.total-despesas').innerHTML = `Total: ${formatCurrency(total)}`
}

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

  despesa.categoria = document.getElementById("categoria").value;
  despesa.nome = document.getElementById("nome").value;
  despesa.descricao = document.getElementById("descricao").value;
  despesa.valor = Number(document.getElementById("valor").value);
  despesa.status = btnStatus.getAttribute("data-pago") === "true";
  despesa.data = document.getElementById("data").value;

  const novaLinha = tabela.insertRow();
  novaLinha.innerHTML = `
    <td>${despesa.categoria}</td>
    <td>${despesa.nome}</td>
    <td>${despesa.valor}</td>
    <td>${despesa.data}</td>
    <td>${despesa.status}</td>
  `;

  // Limpar e fechar modal
  form.reset();
  modal.style.display = "none";
  calcularTotal(despesa.valor);
});

// Botão de alterar o status do pagamento
const btnStatus = document.querySelector(".btn-status");

btnStatus.addEventListener("click", () => {
  const pago = btnStatus.getAttribute("data-pago") === "true";
  
  if (pago) {
    btnStatus.setAttribute("data-pago", "false");
    btnStatus.textContent = "Não Pago";
    btnStatus.classList.remove("pago");
  } else {
    btnStatus.setAttribute("data-pago", "true");
    btnStatus.textContent = "Pago";
    btnStatus.classList.add("pago");
  }
});
*/
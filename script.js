const items = document.querySelectorAll('.item');
const boxes = document.querySelectorAll('.card');

let selected = null;

function configurarItem(item) {
  item.addEventListener('dragstart', (e) => {
    selected = e.target;
  });
}

function configurarBox(box) {
  box.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  box.addEventListener('drop', (e) => {
    e.preventDefault();
    if (selected) {
      box.appendChild(selected);
      selected = null;
    }
  });
}

items.forEach(configurarItem);
boxes.forEach(configurarBox);

// TESTE 2

const container = document.querySelector(".container");
const botao = document.querySelector(".btn-adicionar");
const cardButton = document.querySelector(".card-button");

botao.addEventListener('click', () => {

    const bloco = document.createElement('div');
    bloco.classList.add('card');
    configurarBox(bloco);

    const conteudo = document.createElement('div');
    configurarItem(conteudo);

    conteudo.textContent = 'Novo bloco';

    bloco.appendChild(conteudo);

    container.insertBefore(bloco, cardButton);
});


// TESTE INPUT DO CARD

const input = document.getElementById('input-name-card');
const text = document.getElementById('card-title');

// Função para transformar o input em texto (quando aperta Enter)
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const value = input.value.trim();
        
        if (value !== "") {
            text.textContent = value; // Define o texto
            
            // Altera a visibilidade
            input.style.display = 'none';
            text.style.display = 'inline';
            
        }
    }
});

// Função para voltar a ser input (quando clica no lápis)
text.addEventListener('click', function() {
    input.style.display = 'inline-block';
    text.style.display = 'none'
    
    input.focus(); // Coloca o cursor de digitação de volta no input
});
const items = document.querySelectorAll('.item');
const boxes = document.querySelectorAll('.card');

let cardIdCounter = 1;
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

const container = document.querySelector(".container");
const botao = document.querySelector(".btn-adicionar");
const cardButton = document.querySelector(".card-button");

// Evento único no container
container.addEventListener('click', (event) => {
  // EXCLUIR CARD
  if (event.target.classList.contains('delete-card')) {

    const card = event.target.closest('.card');

    if (card) {
      card.remove();
    }

    return;
  }

  handleInputName(event);
});

// Adicionar card
botao.addEventListener('click', () => {
  createCard(cardIdCounter);
  cardIdCounter++;
});


// INPUT DO CARD

function handleInputName(event) {

  // Descobre em qual card aconteceu o clique
  const card = event.target.closest('.card');

  // Se o clique não aconteceu dentro de um card, sai
  if (!card) {
    return;
  }

  // Procura os elementos SOMENTE dentro desse card
  const input = card.querySelector('.input-name-card');
  const text = card.querySelector('.card-title');

  // Clicou no título
  if (event.target.closest('.card-title')) {

    input.style.display = 'inline-block';
    text.style.display = 'none';

    input.focus();
  }


  // Clicou no input
  if (event.target.closest('.input-name-card')) {

    input.addEventListener('keydown', function(event) {

      if (event.key === 'Enter') {

        const value = input.value.trim();

        if (value !== "") {

          text.textContent = value;

          input.style.display = 'none';
          text.style.display = 'inline';

          card.dataset.name = value;

        }
      }
    });
  }
}


function createCard(idCard) {

  const bloco = document.createElement('div');

  bloco.classList.add('card');

  configurarBox(bloco);


  const conteudo = document.createElement('div');

  configurarItem(conteudo);


  conteudo.innerHTML = `
    <div class="name-card">

      <input
        type="text"
        class="input-name-card"
        placeholder="Descrição"
      >

      <span
        class="card-title"
        title="Clique para editar"
      ></span>

      <span class="space"></span>

      <button class="delete-card">❌</button>

    </div>
  `;


  bloco.dataset.id = idCard;

  bloco.appendChild(conteudo);

  container.insertBefore(bloco, cardButton);
}
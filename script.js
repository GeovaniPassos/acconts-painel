const items = document.querySelectorAll('.item');
const boxes = document.querySelectorAll('.box');

let selected = null;

// Adiciona eventos em cada item arrastável
items.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    selected = e.target;
  });
});

// Adiciona eventos em cada caixa de destino
boxes.forEach(box => {
  box.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessário para permitir o "drop"
  });

  box.addEventListener('drop', (e) => {
    e.preventDefault();
    if (selected) {
      box.appendChild(selected);
      selected = null;
    }
  });
});

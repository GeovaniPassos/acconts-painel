export function initTables() {

    const btnTableExpense = document.querySelector('.tab-expenses');
    const btnTableReceipt = document.querySelector('.tab-receipts');
    const btnTableFluxo = document.querySelector('.tab-fluxo');

    btnTableExpense?.addEventListener('click', () => openTab('expenses'));
    btnTableReceipt?.addEventListener('click', () => openTab('receipts'));
    btnTableFluxo?.addEventListener('click', () => openTab('fluxo'));
}

export function openTab(tab) {
    // esconder todas
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // mostrar a escolhida
    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-${tab}`).classList.add('active');
}
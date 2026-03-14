export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2);
}

export default formatCurrency;

export function formatMoney(value) {
    //return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export function  calculateExpenses(expesesList) {

    const totals = expesesList.reduce((acc, expense) => {
        const value = Number(expense.value) || 0;
        const isPaid = expense.payment === true || expense.payment === "true";

        acc.total += value;
        if (isPaid) {
            acc.paid += value;
        } else {
            acc.pending += value;
        }
        
        return acc;
    }, { total: 0, paid: 0, pending: 0 });

    return totals;
}
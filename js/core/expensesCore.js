export function buildEditFormModel(expense) {
    return {
        id: expense.id,
        name: expense.name,
        description: expense.description,
        categoryName: expense.categoryName,
        value: expense.value,
        installment: expense.installment,
        payment: expense.payment === true || expense.payment === "true",
        paymentDate: expense.paymentDate,
        date: expense.date
    };
}
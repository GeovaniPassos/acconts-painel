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

export async function ensureCategoryExists(categoryTyped, categories, categoriesData, service) {
    if (!categoryTyped) return null;
    const categoryExists = categories.some(cat => cat.toLowerCase() === categoryTyped.toLowerCase());
    if (categoryExists) return null;

    const categoryCreate = {
        name: categoryTyped,
        type: "EXPENSES"
    };

    const newCategory = await service.createCategory(categoryCreate);

    categories.push(newCategory.name);
    if (typeof categoriesData !== 'undefined') {
        categoriesData.push(newCategory);
    }

    return newCategory;
}
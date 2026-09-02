export function buildEditFormModel(receipt) {
    return {
        id: receipt.id,
        name: receipt.name,
        description: receipt.description,
        categoryName: receipt.categoryName,
        value: receipt.value,
        date: receipt.date
    };
}
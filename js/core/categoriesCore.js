export function findCategoryByName(categoriesList, value) {

    categoriesList = categoriesList.map(cat => cat.name);

    categoriesList.find(cat => 
        cat.toLowerCase().startsWith(value.toLowerCase())
    );
    
    return categoriesList;
}

export function newCategory(categoryName) {
    const categoryCreate = {
        name: categoryName,
        type: "EXPENSES"
    };
    
    return categoryCreate;
}

export function filterCategories(categories, text) {
    if (categories === null || text === null) {
        return [];
    }

    const term = text.toLowerCase().trim();

    return categories.find(cat => cat.name.toLowerCase() === term);
}
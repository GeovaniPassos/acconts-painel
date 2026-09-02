export function findCategoryByName(categoriesList, value) {

    const categoryNames = categoriesList.map(cat => cat.name);

    return categoryNames.find(cat => 
        cat.toLowerCase().startsWith(value.toLowerCase())
    );
}

export function filterCategories(categories, text, type) {
    if (categories === null || text === null || type === null) {
        return [];
    }

    const term = text.toLowerCase().trim();

    const cat = categories.find(cat => cat.name.toLowerCase() === term && 
        cat.type.toLowerCase() === type.toLowerCase());

    return cat;
}
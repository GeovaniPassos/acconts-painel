import { VARIABLE_CONNECTION } from "../config/config.js";
import { filterCategories, findCategoryByName } from "../core/categoriesCore.js";
import Service from "../services/service.js";

import * as categoriesUi from "../ui/categoriesUi.js";

const service = new Service(VARIABLE_CONNECTION);

let categoriesList = [];

export async function getCategories() {

    categoriesList = await service.getCategory();
    return await categoriesList;
    
}

export async function createCategory(name) {
    if (!name) {
        throw new Error("O nome da categoria é obrigatório.");
    }

    const data = { name, type: "EXPENSES" };
    const category = await service.createCategory(data);
    return category;
}


export async function getCategoriesNames(value){
    return await service.getCategoryByName(value);
}

export function checkCategory(text) {
    const list = categoriesList.filter(
            cat => cat.name.toLowerCase().startsWith(text.toLowerCase())
        );
    return list; 
}

export function handleCategoryTyping(text) {
    if (!text || text.length < 1) {
        categoriesUi.clearCategorySuggestions();
        return;
    }

    const categories = checkCategory(text);

    if (!categories) return;

    categoriesUi.renderCategorySuggestions(categories);
}

export async function findOrCreateCategory(categoryName) {
    if (!categoryName) {
        throw new Error("O nome da categoria é obrigatório.");
    }

    let category = filterCategories(categoriesList, categoryName);

    if (category) {
        return category.name;
    } else {
        await createCategory(categoryName);
        await getCategories();
        return filterCategories(categoriesList, categoryName).name;
    }
}
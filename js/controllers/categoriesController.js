import { VARIABLE_CONNECTION } from "../config/config.js";
import { findCategoryByName } from "../core/categoriesCore.js";
import Service from "../services/service.js";

import * as core from "../core/categoriesCore.js";
import * as categoriesUi from "../ui/categoriesUi.js";
import * as categoriesCore from "../core/categoriesCore.js";

const service = new Service(VARIABLE_CONNECTION);

let categoriesList = [];

export async function getCategoriesNames(value){
    
    categoriesList = await findCategoryByName(categoriesList, value);

    return categoriesList;
}

export async function checkCategory(categoryName) {

    if (!categoryName) return null;

    return await service.getCategoryByName(categoryName);
}

export async function handleCategoryTyping(text) {
    if (!text || text.length < 1) {
        categoriesUi.clearCategorySuggestions();
        return;
    }

    const categories = await service.getCategory();
    
    if (!categories) return;

    const filtered = categoriesCore.filterCategories(categories, text);

    categoriesUi.renderCategorySuggestions(filtered);
}
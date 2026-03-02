import { VARIABLE_CONNECTION } from "../config/config.js";
import { findCategoryByName } from "../core/categoriesCore.js";
import Service from "../services/service.js";
import * as core from "../core/categoriesCore.js";

const service = new Service(VARIABLE_CONNECTION);

let categoriesList = service.getCategory();

export async function getCategoriesNames(value){
    
    categoriesList = await findCategoryByName(categoriesList, value);

    return categoriesList;
}

export async function checkCategory(categoryName) {
    if (!categoryName) return null;

    const categoriesList = await service.getCategory();
    let category = categoriesList.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
        const newCategory = core.newCategory(categoryName);
        category = await service.createCategory(newCategory);
    }

    return category;
}
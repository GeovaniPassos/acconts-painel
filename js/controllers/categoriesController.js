import { VARIABLE_CONNECTION } from "../config/config.js";
import { findCategoryByName } from "../core/categoriesCore.js";
import Service from "../services/service.js";

const service = new Service(VARIABLE_CONNECTION);

let categoriesList = service.getCategory();

export async function getCategoriesNames(value){
    
    categoriesList = findCategoryByName(categoriesList, value);

    return categoriesList;
}
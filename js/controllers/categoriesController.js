import { VARIABLE_CONNECTION } from "../config/config.js";
import { findCategoryByName } from "../core/categoriesCore.js";
import Service from "../services/service.js";

const service = new Service(VARIABLE_CONNECTION);

export default class categoriesController {

    categoriesList = service.getCategory();

    async getCategoriesNames(value){
        
        categoriesList = findCategoryByName(categoriesList, value);

        return categoriesList;
    }

}
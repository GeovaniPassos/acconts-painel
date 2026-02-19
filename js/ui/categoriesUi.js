import categoriesController from "../controllers/categoriesController.js";

const categoryController = new categoriesController();

export function findCategories(value) {

    categoryController.getCategoriesNames(value);
    
}
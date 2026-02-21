import { getCategoriesNames } from "../controllers/categoriesController.js";

export function findCategories(value) {

    return getCategoriesNames(value);
}
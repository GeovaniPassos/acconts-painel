import { getCategoriesNames } from "../controllers/categoriesController.js";

export async function findCategories(value) {
    return await getCategoriesNames(value);
}
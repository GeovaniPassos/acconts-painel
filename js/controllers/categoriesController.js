import { VARIABLE_CONNECTION } from "../config/config";
import Service from "../services/service";

const service = new Service();

export default class categoriesController {
    service = new Service(VARIABLE_CONNECTION);

    async getCategoriesNames(){
        const categoriesList = await service.getCategory();
        categoriesList = categoriesList.map(cat => cat.name)

        return categoriesList;
    }
}
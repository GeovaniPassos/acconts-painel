import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";

const service = new Service(VARIABLE_CONNECTION);

export async function login(username, password) {

    try {
        await service.login(username, password);
    } catch(error) {
         alert(error.message);
    }
}
import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";

const service = new Service(VARIABLE_CONNECTION);

export const getCashflowCards = () => service.getCashflowCards();
export const createCashflowCard = name => service.createCashflowCard(name);
export const updateCashflowCard = (id, name) => service.updateCashflowCard(id, name);
export const deleteCashflowCard = id => service.deleteCashflowCard(id);

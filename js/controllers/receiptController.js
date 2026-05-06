import { VARIABLE_CONNECTION } from "../config/config.js";
import Service from "../services/service.js";
import * as date from "../utils/date.js";
import * as feedback from "../ui/feedback.js";
import * as receiptUi from "../ui/receiptUi.js";
import * as sumary from "../ui/sumary.js";
import { searchParams } from "./searchController.js";

const service = new Service(VARIABLE_CONNECTION);
let receiptList = [];

export function initReceipt() {
    getListReceiptsCurrentMonth();
}

export async function getListReceiptsCurrentMonth() {
    try {
        feedback.setLoading(true);
        searchParams.startDate = date.getCurrentMonthPeriod().startDate;
        searchParams.endDate = date.getCurrentMonthPeriod().endDate;
        searchParams.name = "";
        receiptList = await service.getReceipts(searchParams.startDate, searchParams.endDate, searchParams.name);
        if (receiptList === null || receiptList.receipt.length == 0) {
            return feedback.showMessage("info", "Nenhuma receita encontrada.");
        }
        receiptUi.renderReceiptList(receiptList);
        //sumary.updateSummary(receiptList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function handleEditReceiptForm(receiptId) {
    const receipt = await service.getReceiptsById(receiptId);
    const formModel = core.buildEditFormModel(receipt);
    formUi.fillFormForEdit(formModel);
}

export async function getReceiptsBySearch(searchParams) {
    try {
        feedback.setLoading(true);
        receiptList = await service.getReceipts(searchParams.startDate, searchParams.endDate, searchParams.name);

        if (receiptList.receipt.length == 0) {
            feedback.showMessage("info", "Nenhuma receita encontrada para o período e nome informados.");
        }
        receiptUi.renderReceiptList(receiptList);
        //sumary.updateSummary(receiptList);
    } catch (e) {
        feedback.showMessage("error", `Falha ao carregar`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function createReceipt(data) {
    try {
        feedback.setLoading(true);
        await service.createReceipts(data);
       
        getReceiptsBySearch(searchParams);
       
        feedback.showMessage("success", "Receita criada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao criar receita.`);
    } finally {
        feedback.setLoading(false);
    }  
}

export async function updateReceipt(id, data) {
    try {
        feedback.setLoading(true);
        await service.updateReceipts(id, data);
        
        getReceiptsBySearch(searchParams);
        
        feedback.showMessage("success", "Receita atualizada com sucesso.");
    } catch (e) {
        feedback.showMessage("error", `Erro ao atualizar receita.`);
    } finally {
        feedback.setLoading(false);
    }
}

export async function deleteReceipt(id) {
    try {
        feedback.setLoading(true);
        await service.deleteReceipts(id);
        
        getReceiptsBySearch(searchParams);
        
        feedback.showMessage("success", "Receita deletada com sucesso.");
    } catch (e) {
        feedback.showMessage("error",`Erro ao deletar a receita com o ${id}.`)
    } finally {
        feedback.setLoading(false);
    }
}   
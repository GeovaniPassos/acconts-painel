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
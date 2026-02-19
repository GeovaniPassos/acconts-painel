//Função para formatar datas
export function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

export function formatDateApi(dateStr) {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
}

//Função para retornar a data em partes
export function getDateParts(date = new Date()) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return { year, month, day };
}

//Função para pegar a data atual e formatar a data igual vem da API
export function getTodayDate() {
    const { year, month, day } = getDateParts();
    return `${day}/${month}/${year}`;
}

// Função para pegar o mes atual
export function getMonthAndYearFromCurrentPeriod() {
    const yearCurrent = getDateParts().year;
    const monthCurrent = getDateParts().month;
    return { monthCurrent, yearCurrent };
}

// Função para pegar o ano atual 
// export function getYearFromTheCurrentPeriod() {
//     return getDateParts().year;
// }
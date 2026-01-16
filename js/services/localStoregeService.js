export default class LocalStorageService {
    async getData() {
        return JSON.parse(localStorage.getItem("data")) || [];
    }
}
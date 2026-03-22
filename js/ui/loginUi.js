import * as loginController from "../controllers/loginController.js";

export function loginInit() {
    const form = document.querySelector('.form-login');
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const username = document.querySelector('.username').value;
        const password = document.querySelector('.password').value;

        loginController.login(username, password);
    });
}
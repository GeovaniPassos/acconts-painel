export function checkAuthentication() {

    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.replace('./login.html');
        return false;
    }

    document.body.style.display = "block";
    return true;
}

export function logout() {
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            window.location.replace('./login.html');
        }
    });
}

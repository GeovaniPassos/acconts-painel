export function checkAuthentication() {

    const token = localStorage.getItem('token');
    
    if (!token) {
        
        setTimeout(() => {
            const retryToken = localStorage.getItem('token');
            if (!retryToken) {
                window.location.href = 'login.html';
            } else {
                document.body.style.display = "block";
            }
        }, 100);
    } else {
        document.body.style.display = "block";
    }
}

export function logout() {
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = authSystem.login(email, password);

        if (result.success) {
            toast.success(result.message);
            setTimeout(() => {
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'profile.html';
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            toast.error(result.message);
        }
    });
});

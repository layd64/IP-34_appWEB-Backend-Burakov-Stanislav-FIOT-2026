document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await authSystem.login(email, password);

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

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async function(e) {
            e.preventDefault();
            const emailField = document.getElementById('email').value;
            if (!emailField) {
                toast.error('Будь ласка, введіть ваш email у поле вище, і спробуйте знову.');
                return;
            }
            toast.info('Надсилаємо лист...');
            const result = await authSystem.forgotPassword(emailField);
            if (result.success) {
                toast.success('Лист для відновлення надіслано! Перевірте пошту.');
            } else {
                toast.error(result.message);
            }
        });
    }
});

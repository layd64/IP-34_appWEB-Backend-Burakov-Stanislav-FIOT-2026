document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            toast.error('Паролі не співпадають');
            return;
        }

        const phone = document.getElementById('phone').value;
        const phoneRegex = /^\+380\d{9}$/;
        if (phone && !phoneRegex.test(phone)) {
            toast.error('Невірний формат телефону. Використовуйте формат +380XXXXXXXXX');
            return;
        }

        const userData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            password: password
        };

        const result = await authSystem.register(userData);

        if (result.success) {
            toast.success(result.message);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2500);
        } else {
            toast.error(result.message);
        }
    });
});

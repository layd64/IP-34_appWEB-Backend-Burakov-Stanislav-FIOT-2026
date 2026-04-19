document.addEventListener('DOMContentLoaded', async function () {
    await authSystem.initPromise;
    const currentUser = authSystem.getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        document.getElementById('adminContent').style.display = 'none';
        document.getElementById('accessDenied').style.display = 'block';
        return;
    }

    await loadUsers();
});

async function loadUsers() {
    try {
        const res = await fetch('http://localhost:3000/api/users', {
            headers: {
                'Authorization': `Bearer ${authSystem.getToken()}`
            }
        });
        
        if (!res.ok) {
            toast.error('Помилка завантаження користувачів');
            return;
        }

        const users = await res.json();
        renderUsers(users);
    } catch (e) {
        toast.error('Помилка з\'єднання з сервером');
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    const currentUser = authSystem.getCurrentUser();

    tbody.innerHTML = users.map(user => {
        const date = new Date(user.createdAt).toLocaleDateString('uk-UA');
        const roleBadge = user.role === 'admin' ? 'admin' : 'користувач';
        const deleteButton = user.role === 'admin' ? '' : `<button class="delete-btn" onclick="deleteUser(${user.id})">Видалити</button>`;
        
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${roleBadge}</td>
                <td>${date}</td>
                <td>${deleteButton}</td>
            </tr>
        `;
    }).join('');
}

window.deleteUser = async function(userId) {
    toast.confirm('Ви впевнені, що хочете видалити цього користувача?', async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authSystem.getToken()}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || 'Помилка видалення');
                return;
            }

            toast.success('Користувача успішно видалено!');
            loadUsers(); // оновлення таблиці
        } catch (e) {
            toast.error('Помилка з\'єднання');
        }
    });
};

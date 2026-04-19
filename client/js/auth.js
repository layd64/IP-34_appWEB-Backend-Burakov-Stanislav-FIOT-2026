// система автентифікації (інтеграція з api)

class AuthSystem {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.currentUser = null;
        this.isInitialized = false;
        this.initPromise = this.initProfile();
    }

    async initProfile() {
        const token = this.getToken();
        if (!token) {
            this.isInitialized = true;
            return;
        }
        try {
            const res = await fetch(`${this.apiBase}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) this.clearToken();
            } else {
                const data = await res.json();
                this.currentUser = { id: data.id, email: data.email, fullName: data.username, phone: data.phone, address: data.address, role: data.role, favorites: [] };
            }
        } catch (e) {}
        this.isInitialized = true;
    }

    getToken() {
        return sessionStorage.getItem('accessToken');
    }

    setToken(token) {
        sessionStorage.setItem('accessToken', token);
    }

    clearToken() {
        sessionStorage.removeItem('accessToken');
    }

    async register(userData) {
        try {
            const res = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.fullName || 'User',
                    email: userData.email,
                    password: userData.password,
                    confirmPassword: userData.password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.error || data.errors?.[0]?.msg || 'Помилка реєстрації' };
            }
            return { success: true, message: data.message || 'Успішно! Тепер перевірте пошту для активації.' };
        } catch (err) {
            return { success: false, message: 'Помилка з\'єднання з сервером' };
        }
    }

    async forgotPassword(email) {
        try {
            const res = await fetch(`${this.apiBase}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            return { success: res.ok, message: data.message || data.error };
        } catch (err) {
            return { success: false, message: 'Помилка з\'єднання з сервером' };
        }
    }

    async login(email, password) {
        try {
            const res = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.error || 'Невірний email або пароль' };
            }
            this.setToken(data.accessToken);
            await this.initProfile();
            return { success: true, message: 'Вхід успішний!' };
        } catch (err) {
            return { success: false, message: 'Помилка з\'єднання з сервером' };
        }
    }

    async logout() {
        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
        } catch (e) {}
        this.clearToken();
        this.currentUser = null;
        return { success: true, message: 'Вихід успішний!' };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async updateProfile(updatedData) {
        try {
            const res = await fetch(`${this.apiBase}/users/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ 
                    username: updatedData.fullName,
                    phone: updatedData.phone,
                    address: updatedData.address
                })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.error || 'Помилка оновлення' };
            return { success: true, message: 'Профіль оновлено!' };
        } catch (e) {
            return { success: false, message: 'Помилка з\'єднання' };
        }
    }

    async changePassword(oldPassword, newPassword) {
        try {
            const res = await fetch(`${this.apiBase}/users/change-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.error || 'Помилка зміни пароля' };
            return { success: true, message: 'Пароль змінено!' };
        } catch (e) {
            return { success: false, message: 'Помилка з\'єднання' };
        }
    }

    // заглушка логіки улюблених, оскільки бекенд цього не вимагає
    toggleFavorite(bookId) {
        return { success: false, message: 'Функція збережена у розробці...' };
    }

    getFavorites() {
        return [];
    }

    isFavorite(bookId) {
        return false;
    }
}

const authSystem = new AuthSystem();

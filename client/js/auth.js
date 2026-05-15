// система автентифікації (інтеграція з api)

class AuthSystem {
    constructor() {
        this.apiBase = '/api';
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
                
                // Fetch favorites
                try {
                    const favRes = await fetch(`${this.apiBase}/users/favorites`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (favRes.ok) {
                        const favData = await favRes.json();
                        this.currentUser.favorites = favData.favorites || [];
                    }
                } catch(e) {}
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

    async toggleFavorite(bookId) {
        if (!this.isAuthenticated() || !this.currentUser) {
            return { success: false, message: 'Будь ласка, увійдіть до облікового запису' };
        }
        
        try {
            const res = await fetch(`${this.apiBase}/users/favorites/${bookId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                // Оновити локальний кеш
                if (data.isFavorite) {
                    // додаємо локально (потрібні дані про книгу для getFavorites, але поки тільки id зберігаємо)
                    if (!this.currentUser.favorites.some(f => f.id == bookId)) {
                        this.currentUser.favorites.push(data.book || { id: parseInt(bookId) });
                    }
                } else {
                    this.currentUser.favorites = this.currentUser.favorites.filter(f => f.id != bookId);
                }
                return { success: true, message: data.message, isFavorite: data.isFavorite };
            } else {
                return { success: false, message: data.error || 'Помилка' };
            }
        } catch (e) {
            return { success: false, message: 'Помилка з\'єднання' };
        }
    }

    getFavorites() {
        return this.currentUser ? this.currentUser.favorites : [];
    }

    isFavorite(bookId) {
        if (!this.currentUser || !this.currentUser.favorites) return false;
        return this.currentUser.favorites.some(fav => fav.id == bookId);
    }
}

const authSystem = new AuthSystem();

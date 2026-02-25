// auth system

class AuthSystem {
    constructor() {
        this.usersKey = 'bookstore_users';
        this.currentUserKey = 'bookstore_current_user';
        this.init();
    }

    init() {
        // init users
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    // register user
    register(userData) {
        const users = this.getUsers();

        // check email
        if (users.find(user => user.email === userData.email)) {
            return { success: false, message: 'Користувач з таким email вже існує' };
        }

        // validate password
        if (userData.password.length < 6) {
            return { success: false, message: 'Пароль повинен містити мінімум 6 символів' };
        }

        // create user
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password, // plain text
            fullName: userData.fullName,
            phone: userData.phone || '',
            address: userData.address || '',
            favorites: [], // init favorites
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        // auto login
        this.login(userData.email, userData.password);

        return { success: true, message: 'Реєстрація успішна!', user: newUser };
    }

    // login
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Невірний email або пароль' };
        }

        // store session
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));

        return { success: true, message: 'Вхід успішний!', user: userWithoutPassword };
    }

    // logout
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return { success: true, message: 'Вихід успішний!' };
    }

    // get current user
    getCurrentUser() {
        const userJson = localStorage.getItem(this.currentUserKey);
        return userJson ? JSON.parse(userJson) : null;
    }

    // check auth
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // get users
    getUsers() {
        const usersJson = localStorage.getItem(this.usersKey);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    // update profile
    updateProfile(updatedData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Користувач не автентифікований' };
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'Користувач не знайдений' };
        }

        // update data
        if (updatedData.password && updatedData.password.length > 0) {
            if (updatedData.password.length < 6) {
                return { success: false, message: 'Пароль повинен містити мінімум 6 символів' };
            }
            users[userIndex].password = updatedData.password;
        }

        users[userIndex].fullName = updatedData.fullName || users[userIndex].fullName;
        users[userIndex].phone = updatedData.phone || users[userIndex].phone;
        users[userIndex].address = updatedData.address || users[userIndex].address;

        localStorage.setItem(this.usersKey, JSON.stringify(users));

        // update session
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));

        return { success: true, message: 'Профіль оновлено!', user: updatedUser };
    }

    // change password
    changePassword(oldPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Користувач не автентифікований' };
        }

        const users = this.getUsers();
        const user = users.find(u => u.id === currentUser.id);

        if (!user || user.password !== oldPassword) {
            return { success: false, message: 'Невірний поточний пароль' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'Новий пароль повинен містити мінімум 6 символів' };
        }

        user.password = newPassword;
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        return { success: true, message: 'Пароль змінено!' };
    }

    // favors management

    // toggle favorite
    toggleFavorite(bookId) {
        // parse id
        const id = parseInt(bookId);
        const currentUser = this.getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'Будь ласка, увійдіть до облікового запису' };
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) return { success: false, message: 'User not found' };

        if (!users[userIndex].favorites) {
            users[userIndex].favorites = [];
        }

        const favorites = users[userIndex].favorites;
        const index = favorites.indexOf(id);

        let action = '';
        if (index === -1) {
            favorites.push(id);
            action = 'added';
        } else {
            favorites.splice(index, 1);
            action = 'removed';
        }

        // save users
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        // update session
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));

        return { success: true, action: action, favorites: favorites };
    }

    // get favorites
    getFavorites() {
        const currentUser = this.getCurrentUser();
        if (!currentUser || !currentUser.favorites) return [];
        return currentUser.favorites;
    }

    // check favorite
    isFavorite(bookId) {
        const favorites = this.getFavorites();
        return favorites.includes(parseInt(bookId));
    }
}

// create instance
const authSystem = new AuthSystem();


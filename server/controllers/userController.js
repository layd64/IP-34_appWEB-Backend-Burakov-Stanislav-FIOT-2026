const { User, Order } = require('../models/index');
const bcrypt = require('bcrypt');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password', 'refreshToken', 'confirmationToken', 'resetPasswordToken'] } });
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { username, phone, address } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

        if (username) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        
        await user.save();

        res.json({ message: 'Профіль оновлено', user: { id: user.id, username: user.username, email: user.email, phone: user.phone, address: user.address } });
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

        if (user.password) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Старий пароль невірний' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Пароль успішно змінено' });
    } catch (err) {
        next(err);
    }
};

const deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

        await user.destroy();
        res.json({ message: 'Акаунт успішно видалено' });
    } catch (err) {
        next(err);
    }
};

const deleteUserByAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

        await user.destroy();
        res.json({ message: 'Користувача видалено адміністратором' });
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ 
            attributes: { exclude: ['password', 'refreshToken', 'confirmationToken', 'resetPasswordToken'] },
            include: 'orders'
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const newUser = await User.create({ username, email });
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { total_amount, status } = req.body;
        const newOrder = await Order.create({ total_amount, status, user_id: userId });
        res.status(201).json(newOrder);
    } catch (err) {
        next(err);
    }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount, getAllUsers, deleteUserByAdmin, createUser, createOrder };

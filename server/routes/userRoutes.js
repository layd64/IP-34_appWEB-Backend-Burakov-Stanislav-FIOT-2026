const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, changePassword, deleteAccount, getAllUsers, deleteUserByAdmin, createUser, createOrder } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const { validatePasswordChange } = require('../middlewares/validators');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, validatePasswordChange, changePassword);
router.delete('/profile', authenticateToken, deleteAccount);

// адміністративні маршрути
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUserByAdmin);

// додавання користувачів і замовлень (незахищено, як було раніше)
router.post('/', createUser);
router.post('/:userId/orders', createOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { register, login, getMe, allUsers, deleteUser, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/', protect, allUsers);

// Admin routes
router.get('/all', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;

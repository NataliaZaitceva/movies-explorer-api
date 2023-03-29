const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, getCurrentUser,
} = require('../controllers/users');
const { updateProfileValidation, getUserValidation } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getUserValidation, getCurrentUser);
router.get('/:userId', getUserValidation, getUserById);

router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;

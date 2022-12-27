const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile,
} = require('../controllers/users');
const { updateProfileValidation, getUserValidation } = require('../middlewares/validation');

router.get('/me', getUsers);

router.get('/:userId', getUserValidation, getUserById);

router.patch('/me', updateProfileValidation, updateProfile);

module.exports = router;

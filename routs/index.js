const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../Errors/NotFoundError');
const { loginValidation, registrationValidation } = require('../middlewares/validation');

router.post('/signin', loginValidation, login);

router.post('/signup', registrationValidation, createUser);

router.use(auth);

// роуты, которым авторизация нужна
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;

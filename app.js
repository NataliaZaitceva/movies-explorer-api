const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DEV_URL } = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimit');

const app = express();

const { NODE_ENV, MONGO_URL } = process.env;

const { PORT = 4000 } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
    'http://mesto.students.nomoredomains.club',
    'https://mesto.students.nomoredomains.club',
    'https://github.com/NataliaZaitceva/react-mesto-api-full.git',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
mongoose.set('strictQuery', false);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_DEV_URL);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use('/', require('./routs/index'));

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

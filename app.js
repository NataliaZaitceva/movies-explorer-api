const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DEV_URL } = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimit');

const { NODE_ENV, MONGO_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
mongoose.set('strictQuery', false);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_DEV_URL);
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

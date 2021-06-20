// const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const helmet = require('helmet');

const limiter = require('./helpers/limiter');
const { HttpCode, Limit } = require('./helpers/constants');
const usersRouter = require('./routes/api/users');
const contactsRouter = require('./routes/api/contacts');

const app = express();
// app.use(express.static(path.join(__dirname, 'public'))); // http://localhost:3000/avatars/60b8ba1e7daf461fe0076565//1622841975237-photo.jpg

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(limiter);
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: Limit.MAX_JSON_SIZE_15KB }));
app.use(boolParser());
app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const code = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = err.status ? 'error' : 'fail';
  res.status(code).json({ status, code, message: err.message });
});

module.exports = app;

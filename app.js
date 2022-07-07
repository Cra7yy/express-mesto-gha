const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  login,
  postUser,
} = require('./controllers/users');
const {
  isAuthorized,
} = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', postUser);

app.use('/users', isAuthorized, userRouter);
app.use('/cards', isAuthorized, cardRouter);

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err.stack);
  res.status(500).send({ message: 'Что-то пошло не так'});
});

app.listen(port);

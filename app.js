const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// const path = require('path');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62a4ac1234fde6e186d8d417',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(port);

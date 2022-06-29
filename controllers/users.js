const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные id' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const postUser = (req, res) => {
  User.create(req.body).then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const changeUserData = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  changeUserData,
  changeAvatar,
};

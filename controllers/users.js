const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const getUser = (req, res) => {
  User.findOne({ userId: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const postUser = (req, res) => {
  User.create(req.body).then((user) => res.status(201).send(user))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' }));
};

const changeUserData = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => {
      if (res.status === 500) {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      } else if (res.status === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
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
    })
    .catch(() => {
      if (res.status === 500) {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      } else if (res.status === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
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

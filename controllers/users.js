const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../helpers/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const InvalidData = () => {
  const error = new Error('переданы некоректные данные');
  error.statusCode = 400;
  throw error;
};

const ErrUserId = () => {
  const error = new Error('Пользователь по указанному _id не найден');
  error.statusCode = 404;
  throw error;
};

const NotForwardedRegistrationData = () => {
  const error = new Error('неправильный email или password');
  error.statusCode = 403;
  throw error;
};

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send(users));
};

const getUserId = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new ErrUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidData();
      }
    });
};

const postUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    InvalidData();
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') throw new InvalidData();
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) res.status(409).send({ message: 'email занят' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotForwardedRegistrationData();
      }
      return generateToken({ email: user.email });
    })
    .then((token) => {
      res.send({ token });
    });
};

const changeUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ErrUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidData();
      }
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ErrUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidData();
      }
    });
};

const getUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrUserId();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidData();
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserId,
  postUser,
  changeUserData,
  changeAvatar,
  login,
};

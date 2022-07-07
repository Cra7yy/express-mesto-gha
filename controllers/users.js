const bcrypt = require('bcrypt');
const User = require('../models/user');
const {generateToken} = require('../helpers/jwt')

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const invalidData = () => {
  const error = new Error('переданы некоректные данные');
  error.statusCode = 400;
  throw error;
};

const errUserId = () => {
  const error = new Error('Пользователь по указанному _id не найден');
  error.statusCode = 404;
  throw error;
};

const notForwardedRegistrationData = () => {
  const error = new Error('неправильный email или password');
  error.statusCode = 403;
  throw error;
};

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(200).send(users));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new errUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new invalidData();
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
    invalidData();
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
      if (err.name === 'ValidationError') {
        throw new invalidData();
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'email занят' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new invalidData();
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new notForwardedRegistrationData();
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new notForwardedRegistrationData();
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
        throw new errUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new invalidData();
      }
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new errUserId();
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new invalidData();
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  changeUserData,
  changeAvatar,
  login,
};

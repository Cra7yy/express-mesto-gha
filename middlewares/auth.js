const { checkToken } = require('../helpers/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуруйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throwUnauthorizedError();
  }

  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);

    User.findOne({ id: payload._id })
      .then((user) => {
        if (user) {
          throwUnauthorizedError();
        }
        req.user._id = user._id;
        next();
      });
  } catch (err) {
    throwUnauthorizedError();
  }
};

module.exports = {
  isAuthorized,
};

const Card = require('../models/card');

const InvalidData = () => {
  const error = new Error('Переданы некоректные данные');
  error.statusCode = 400;
  throw error;
};

const ErrCardId = () => {
  const error = new Error('Карточка с указанным _id не найдена');
  error.statusCode = 404;
  throw error;
};

const NotDeleteCardId = () => {
  const error = new Error('Чужую карточку удалить нельзя');
  error.statusCode = 403;
  throw error;
};

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards));
};

const postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidData();
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId }).then((card) => {
    if (!card) {
      throw new ErrCardId();
    } else if (card.owner !== req.user.cardId.toSting()) {
      throw new NotDeleteCardId();
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidData();
    }
  });
};

const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new ErrCardId();
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidData();
    }
  });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new ErrCardId();
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidData();
    }
  });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};

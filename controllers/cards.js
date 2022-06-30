const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const postCard = (req, res) => {
  const owner = req.uer._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link }).then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId }).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные id' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
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
      res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные id' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
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
      res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(200).send(card);
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные id' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
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

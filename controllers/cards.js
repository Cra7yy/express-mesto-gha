const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const postCard = (req, res) => {
  Card.create(req.body).then((card) => res.status(201).send(card))
    .catch(() => res.status(400).send({ message: ' Переданы некорректные данные при создании карточки' }));
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete(req.params.cardId).then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    } else {
      res.status(200).send(card);
    }
  })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
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
  }).catch(() => {
    if (res.status === 500) {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    } else if (res.status === 400) {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
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
  }).catch(() => {
    if (res.status === 500) {
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    } else if (res.status === 400) {
      res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка' });
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

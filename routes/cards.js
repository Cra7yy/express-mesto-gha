const router = require('express').Router();
const {
  getCards,
  postCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;

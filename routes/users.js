const router = require('express').Router();
const {
  getUsers,
  getUser,
  postUser,
  changeUserData,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', postUser);
router.patch('/me', changeUserData);
router.patch('/me/avatar', changeAvatar);

module.exports = router;

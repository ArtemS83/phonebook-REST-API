const express = require('express');
const router = express.Router();

const {
  validateLogin,
  validateSignup,
  validateStatusSubscription,
  validateAvatar,
  validateEmail,
} = require('./validation');
const guard = require('../../../helpers/guard');
const ctrl = require('../../../controllers/users');
const upload = require('../../../helpers/upload');

router.post('/signup', validateSignup, ctrl.signup);
router.get('/verify/:verificationToken', ctrl.verify);
router.post('/verify', validateEmail, ctrl.repeatSendEmailVerify);
router.post('/login', validateLogin, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.current);
router.patch('/', guard, validateStatusSubscription, ctrl.subscription);
router.patch(
  '/avatars',
  [guard, upload.single('avatar')],
  validateAvatar,
  ctrl.avatars,
); // 'avatar'- name в инпуте формы name="avatar"

module.exports = router;

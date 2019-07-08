const express = require('express');
const router = express.Router();
const {validateUser} = require('../model/User');
const UserController = require('../controllers/userCont');
const auth = require('../middlewares/auth');
const { validAccount } = require('../model/Account');
const AccountController = require('../controllers/accountCont');

router.post(
    '/signup'
    , validateUser
    , UserController.signup()
)

router.post(
    '/login'
    , UserController.login()
)

router.post(
    '/:_id/account'
    , auth
    , validAccount
    , AccountController.create()
)

router.get(
    '/'
    , UserController.show()
)


module.exports = router;
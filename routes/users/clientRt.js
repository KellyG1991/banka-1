const express = require('express');
const router = express.Router();
const {validateUser} = require('../../model/User');
const UserController = require('../../controllers/userCont');
const auth = require('../../middlewares/auth');
const { validAccount } = require('../../model/Account');
const AccountController = require('../../controllers/accountCont');

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
    '/account'
    , auth
    , validAccount
    , AccountController.create()
)






module.exports = router;
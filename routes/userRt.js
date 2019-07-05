const express = require('express');
const router = express.Router();
const {validateUser} = require('../model/User');
const UserController = require('../controllers/userCont');

router.post(
    '/signup'
    , validateUser
    , UserController.signup()
)





module.exports = router;
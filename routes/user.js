const express = require('express');
const router = express.Router();
const { validRegister  } = require('../model/User');
const UserController = require('../controllers/user');

// Register user
router.post(
    '/'
    , validRegister
    , UserController.post()
)

module.exports = router;

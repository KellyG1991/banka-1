const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminCont');
const { adminRegister } = require('../model/Admin');

router.post(
    '/'
    , adminRegister
    , AdminController.createAdmin()
)


module.exports = router;


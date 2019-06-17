const express = require('express');
const router = express.Router();
const { clientRegister } = require('../model/Client');
const ClientController = require('../controllers/clientCont');

router.post(
    '/'
    , clientRegister
    , ClientController.createClient()
)

module.exports = router;
const express = require('express');
const router = express.Router();
const { validDeposit } = require('../../model/Transactions/Deposit');
const DepositController = require('../../controllers/transactions/depositCont');

router.post(
    '/:_id/deposits'
    , validDeposit
    , DepositController.deposit()
)


module.exports = router;
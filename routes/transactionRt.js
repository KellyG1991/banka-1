const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authT');
const acc = require('../middlewares/authAcc');
const { validTransaction } = require('../model/Transaction');
const TransactionController = require('../controllers/transactionCont');

router.post(
    '/account/me'
    , acc
    , validTransaction
    , TransactionController.transaction()
)

router.get(
    '/'
    , acc
    , TransactionController.showAll()
)
router.get(
    '/date'
    , acc
    , TransactionController.byDate()
)

router.get(
    '/me'
    , acc
    , auth
    , TransactionController.index()
)


module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authT');
const { validTransaction } = require('../model/Transaction');
const TransactionController = require('../controllers/transactionCont');

router.post(
    '/:_id'
    , validTransaction
    , TransactionController.transaction()
)

router.get(
    '/'
    , auth
    , TransactionController.showAll()
)
router.get(
    '/date'
    , auth
    , TransactionController.byDate()
)

router.get(
    '/:_id'
    , auth
    , TransactionController.index()
)


module.exports = router;
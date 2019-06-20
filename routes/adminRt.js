const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/Admin/adminAuth');
const AdminController = require('../controllers/adminCont');
const { adminRegister } = require('../model/Admin');
const {staffRegister} = require('../model/Staff');
const staffAuth = require('../middlewares/Staff/staffAuth');
const StaffController = require('../controllers/staffCont');

router.post(
    '/'
    , adminRegister
    , AdminController.createAdmin()
)

router.post(
    '/staff'
    , adminAuth
    , staffRegister
    , StaffController.createStaff()
)

router.get(
    '/staff/account/:_id'
    , staffAuth
    , StaffController.accounts()
)

router.put(
    '/staff/account/:_id/:owner/credit'
    , staffAuth
    , StaffController.creditAccount()
)

router.put(
    '/staff/account/:_id/:owner/debit'
    , staffAuth
    , StaffController.debitAccount()
)


module.exports = router;


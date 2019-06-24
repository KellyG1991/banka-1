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
    '/account'
    , adminAuth
    , StaffController.getAccounts()
)

router.get(
    '/staff/account'
    , staffAuth
    , StaffController.getAccounts()
)

router.get(
    '/account/:_id'
    , adminAuth
    , StaffController.accounts()
)

router.get(
    '/staff/account/:_id'
    , staffAuth
    , StaffController.accounts()
)

router.put(
    '/staff/account/:_id/credit'
    , staffAuth
    , StaffController.creditAccount()
)

router.put(
    '/staff/account/:_id/debit'
    , staffAuth
    , StaffController.debitAccount()
)

router.put(
    '/staff/account/:_id/activate'
    ,staffAuth
    ,StaffController.activate()
)

router.delete(
    '/account/:_id'
    , adminAuth
    , StaffController.deleteAccount()
)

router.delete(
    '/staff/account/:_id'
    , staffAuth
    , StaffController.deleteAccount()
)


module.exports = router;


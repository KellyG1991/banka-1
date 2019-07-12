const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const authTrans = require('../../middlewares/authT');
const admin = require('../../middlewares/admin');
const staff = require('../../middlewares/staff');
const { validateUser } = require('../../model/User');
const StaffController = require('../../controllers/staffCont');
const AdminController = require('../../controllers/adminCont');


/**
 * Admin
 */
router.post(
    '/'
    , validateUser
    , AdminController.signup()
)

router.post(
    '/renewToken'
    , AdminController.renewToken()
)

router.get(
    '/'
    , auth
    , admin
    , AdminController.show()
)
router.get(
    '/:_id'
    , auth
    , admin
    , AdminController.index()
)

/**
 * Cashier/Staff
 */
router.post(
    '/staff'
    , auth
    , admin
    , validateUser
    , StaffController.signup()
)
router.post(
    '/staff/renewToken'
    , StaffController.renewToken()
)

router.post(
    '/staff/:accountNumber/:_id/credit'
    , auth
    , staff
    , authTrans
    , StaffController.credit()
)

router.post(
    '/staff/:accountNumber/:_id/debit'
    , auth
    , staff
    , authTrans
    , StaffController.debit()
)

router.get(
    '/staff/users'
    , auth
    , staff
    , StaffController.show()
)

router.get(
    '/staff/users/:_id'
    , auth
    , staff
    , StaffController.index()
)

router.delete(
    '/staff/account/:_id'
    , auth
    , staff
    , StaffController.deactivate()
)


module.exports = router;
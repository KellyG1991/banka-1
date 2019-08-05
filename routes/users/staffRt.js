const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const acc = require('../../middlewares/authAcc')
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
    , auth
    , admin
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
    , auth
    , staff
    , StaffController.renewToken()
)

router.post(
    '/staff/accounts/credit'
    , auth
    , staff
    , acc
    , authTrans
    , StaffController.credit()
)

router.post(
    '/staff/accounts/debit'
    , auth
    , staff
    , acc
    , authTrans
    , StaffController.debit()
)

router.get(
    '/staff/accounts'
    , auth
    , staff
    , StaffController.showAccounts()
)

router.get(
    '/staff/accounts/me'
    , auth
    , staff
    , acc
    , StaffController.indexAccount()
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
    '/staff/accounts'
    , auth
    , staff
    , acc
    , StaffController.deactivate()
)


module.exports = router;
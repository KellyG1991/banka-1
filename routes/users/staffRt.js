const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth')
const admin = require('../../middlewares/admin');
const { validateUser } = require('../../model/User');
const StaffController = require('../../controllers/staffCont');
const AdminController = require('../../controllers/adminCont');

router.post(
    '/'
    , validateUser
    , AdminController.signup()
)

router.post(
    '/renewToken'
    , AdminController.renewToken()
)

router.post(
    '/staff'
    , auth
    , admin
    , validateUser
    , StaffController.signup()
)



module.exports = router;
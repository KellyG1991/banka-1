const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/Admin/adminAuth');
const AdminController = require('../controllers/adminCont');
const { adminRegister } = require('../model/Admin');
const {staffRegister} = require('../model/Staff')
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


module.exports = router;


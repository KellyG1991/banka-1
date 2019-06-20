const express = require('express');
const router = express.Router();
const { clientRegister} = require('../model/Client');
const { accountRegister } = require('../model/Account');
const adminAuth = require('../middlewares/Admin/adminAuth')
const authAcc = require('../middlewares/Client/loginAuth');
const authClient = require('../middlewares/Client/clientAuth');
const ClientController = require('../controllers/clientCont');
const LoginController = require('../controllers/clientCont');


//
    //
        // ALL CLIENT REQUESTS
    //
//
router.post(
    '/'
    , clientRegister
    , ClientController.createClient()
)

router.post(
    '/login'
    , authClient
    , LoginController.loginRequest()
)

router.delete(
    '/:_id'
    , adminAuth
    , ClientController.deleteClient()
)

router.get(
    '/'
    , adminAuth
    , ClientController.showClients()
)

router.get(
    '/:_id'
    , adminAuth
    ,ClientController.indexClient()
)



//
    //
        // ALL Account REQUESTS
    //
//

router.post(
    '/account'
    , authAcc
    , accountRegister
    , ClientController.accountCreate()
)







module.exports = router;
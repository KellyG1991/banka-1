const express = require('express');
const router = express.Router();
const { Account, validate } = require('../model/accountModel');
const auth = require('../middlewares/authToken');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');


// Create Account
router.post('/', auth, async function(req,res){
    try{
        // We check if there is any validation errors
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    // We check if account already exists using email
    let account = await Account.findOne({ID: req.body.ID});
    if(account){
        res.status(400).send('Account already exists')
    }
    // We create Account
    account = new Account(_.pick(req.body,['ID','Address','Phone','Email','Name','DOB','AccountType']));
    await account.save();

    // We create a token
    const token = await jwt.sign({_id:account._id}, config.get('jwtAccountKey'));

    // We send a success message
    res.header('x-account-token',token).send('Account Created Successfully. Your Account ID is: '+ account._id);
    }catch(err){
        res.status(400).send(err.message);
    }
});

// Delete Account
router.delete('/:_id', auth , async function(req,res){
    const account = await Account.findByIdAndDelete(req.params._id);
    if(!account){
        res.status(400).send('Account does not exist');
    }
    await account.save();
    res.send('Account Deleted');
})


module.exports = router;
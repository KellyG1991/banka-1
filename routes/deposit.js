/**
 * Deposit Page.......unfinished! @todo WORK ON THE DEPOSIT CREATION ON LINE 34
 */


const express = require('express');
const router = express.Router();
const logger = require('node-loggly-bulk');
const _ = require('lodash');
const Joi = require('joi');
const auth = require('../middlewares/authAccount');
const { Account } = require('../model/accountModel');
const { Deposit, validating } = require('../model/depositModel');
const jwt = require('jsonwebtoken');
const config = require('config');

// Make a deposit/POST
router.post('/', auth , async function(req,res){
    try{
        // We check for errors in the deposit body
        const { error } = validating(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
        }

         // We create a container for the account
        const account = await Account.findOne(req.params.Name);
        if(!account){
            res.status(400).send('User Does not exist')
        }
       
         // We make our deposit
        const deposit = new Deposit({
            Account_Name : account.Name,
            Account_Number : account._id,
            Amount: req.body.Amount,
            Date: req.body.Date
        });
       

        await deposit.save();
        res.send(deposit);

    /*
        // token
        const token = jwt.sign({_id:deposit._id},config.get('jwtAccountKey'));
    
        // log the activity
        const client = await logger.createClient({
            token: token,
            subdomain: '/api/deposits',
            json: true
        })
    
        res.send(client);
        */
    }catch(err){
        res.send(err.message);
    }
});

// Delete deposit
router.delete('/:_id', auth , async function(req,res){
    const deposit = await Deposit.findByIdAndDelete(req.params._id);
    if(!deposit){
        res.status(400).send('Transaction does not exist');
    }
    await deposit.save();
    res.send('Transaction Deleted');
})





module.exports = router;
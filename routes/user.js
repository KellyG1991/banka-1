const express = require('express');
const router = express.Router();
const { User, validate } = require('../model/userModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Register User
router.post('/', async function(req,res){
    try{
        const { error } = validate(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        // We check if the user already exists
        let user = await User.findOne({email: req.body.email});
        if(user){
            res.status(400).send('Sorry, user already exists');
        }
        // We create the user
        user = new User(_.pick(req.body, ['username', 'email', 'password']));
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(user.password,salt);
        await user.save();
    
        res.send(_.pick(user,['username','email']));
    }catch(err){
        res.status(500).send(err.message);
    }
    
});

module.exports = router;

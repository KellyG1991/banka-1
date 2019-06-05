const express = require('express')
const { User } = require('../model/userModel');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');


// Logging in
router.post('/', async function(req,res){
    const { error } = loginValidator(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    // we validate the email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(400).send('Invalid Email or Password');
    }
    // we validate the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).send('Invalid Email or Password');
    }

    await user.save();

    // We create a login token
    const token = jwt.sign({_id:user._id},config.get('jwtPrivateKey'));
    res.header('x-auth-token',token).send('Successfully Logged In');
});


// we create a separate joi validator
function loginValidator(user){
    const schema = {
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).max(100).required()
    }
    return Joi.validate(user, schema);
}




module.exports = router;
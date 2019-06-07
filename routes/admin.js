const express = require('express');
const router = express.Router();
const { Admin, validate } = require('../model/adminModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

// We create an admin
router.post('/', async function(req,res){
    try{
        const { error } = validate(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        // We check if admin exists
        let admin = await Admin.findOne({email: req.body.email});
        if(admin){
            res.status(400).send('Admin already exists');
        };
        admin = new Admin(_.pick(req.body,['username','email','password','isAdmin']));
        const salt = await bcrypt.genSalt(8);
        admin.password = await bcrypt.hash(admin.password, salt);
    
        await admin.save();
    
        // token
        const token = jwt.sign({_id: admin._id, isAdmin: admin.isAdmin},config.get('jwtAdminKey'));
    
        res.header('x-admin-token', token).send('Admin Created successfully');
    }catch(err){
        res.status(500).send(err.message);
    }
    
});

// delete admin
router.delete('/:_id', async function(req,res){
    const admin = await Admin.findByIdAndDelete(req.params._id);
    if(!admin){
        res.status(400).send('Transaction does not exist');
    }
    await admin.save();
    res.send('Admin Deleted');
})



module.exports = router;
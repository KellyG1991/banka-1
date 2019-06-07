const express = require('express');
const router = express.Router();
const { Staff, validate } = require('../model/staffModel');
const { verify , adminToken } = require('../middlewares/adminToken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

// We create an admin
router.post('/', [adminToken , verify], async function(req,res){
    try{
        const { error } = validate(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        // We check if staff exists
        let staff = await Staff.findOne({email: req.body.email});
        if(staff){
            res.status(400).send('Staff already exists');
        };
        staff = new Staff(_.pick(req.body,['username','email','password','position','isStaff']));
        const salt = await bcrypt.genSalt(8);
        staff.password = await bcrypt.hash(staff.password, salt);
    
        await staff.save();
    
        // token
        const token = jwt.sign({_id: staff._id, isStaff: staff.isStaff},config.get('jwtStaffKey'));
    
        res.header('x-staff-token', token).send('Staff Created successfully');
    }catch(err){
        res.status(500).send(err.message);
    }
    
});

// delete staff
router.delete('/:_id', async function(req,res){
    const staff = await Staff.findByIdAndDelete(req.params._id);
    if(!staff){
        res.status(400).send('Transaction does not exist');
    }
    await staff.save();
    res.send('Staff Deleted');
})



module.exports = router;
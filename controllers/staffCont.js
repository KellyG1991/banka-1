const _ = require('lodash');
const { Staff } = require('../model/Staff');
const { Account } = require('../model/Account');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports = class {
    static createStaff() {
        return async (req,res) => {
            try{
                let staff = await Staff.findOne({ID: req.body.ID});
                if(staff) return res.status(422).json({message: 'Staff already exists'});

                staff = new Staff(_.pick(req.body, ['ID', 'email', 'firstName', 'lastName', 'password']));
                const salt = await bcrypt.genSalt(10);
                staff.password = await bcrypt.hash(staff.password, salt);
                await staff.save();

                // generate staff token
                const token = jwt.sign({_id: staff._id}, config.get('jwtStaff'));
                res.header('x-staff-token',token).json({message: 'You have successfully created Staff Member'});
            }catch(err){res.send(err.message)}
        }
    }

    
    // get a single account
    static accounts() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id);
                if(!account) return res.status(404).json({message: 'Account not found'});
     
                res.send(account);
            }catch(err){res.send(err.message)}
          
        }
    }

    // Update an account
    static updateAccount() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id);
                if(!account) return res.status(404).json({message: 'Account Not found'});
                
                // Update only balance
                account.balance = req.body.balance;
                await account.save();

                res.send(account);
            
            }catch(err){res.send(err)}   
        }
        
    }
}

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

    // get all accounts
    static getAccounts() {
        return async (req,res) => {
            try{
                let account = await Account.find().populate('client', 'ID email firstName lastName');
                if(!account) return res.status(404).json({message: 'No Accounts found'});
     
                res.send(account);
            }catch(err){res.send(err.message)}
          
        }
    }

    
    // get a single account
    static accounts() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id).populate('client', 'ID email firstName lastName');
                if(!account) return res.status(404).json({message: 'Account not found'});
     
                res.send(account);
            }catch(err){res.send(err.message)}
          
        }
    }

    // Credit an account
    static creditAccount() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id).populate('client', 'ID email firstName lastName');
                if(!account) return res.status(404).json({message: 'Account Not found'});
                
                // Update only balance
                account.balance = parseFloat(account.balance) + parseFloat(req.body.balance);
                account.status = 'active'
                account.updatedOn = Date.now();

                await account.save();

                res.send(account);
            
            }catch(err){res.send(err)}   
        }
        
    }

    // debit an account
    static debitAccount() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id);
                if(!account) return res.status(404).json({message: 'Account Not found'});
                
                // Update only balance
                account.balance = parseFloat(account.balance) - parseFloat(req.body.balance);
                account.status = 'active';
                account.updatedOn = Date.now();
                await account.save();

                res.send(account);
            
            }catch(err){res.send(err)}   
        }
        
    }

    // activate an account
    static activate() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id).populate('client', 'ID email firstName lastName');
                if(!account) res.status(404).json({message: 'Account Not Found'});

                account.status = req.body.status
                await account.save();

                res.json({message: 'Account status changed'});
            }catch(err){return res.json({message: err.message})}
        }
    }

    // Delete an account
    static deleteAccount() {
        return async (req,res) => {
            try{
                let account = await Account.findByIdAndDelete(req.params._id);
                if(!account) return res.status(404).json({message: 'Account does not Exist!'})

                res.json({message: 'Account Deleted Successfully'});
            }catch(err){res.send(err)}
        }
    }
}

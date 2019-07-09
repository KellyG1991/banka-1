const { Transaction } = require('../model/Transaction');
const { Account } = require('../model/Account');
const _ = require('lodash');


module.exports = class {
    static transaction() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id);
                let transaction = new Transaction(_.pick(req.body,['type','accountName', 'accountNumber', 'amount']))
                
                if(account.accountName !== transaction.accountName){
                    throw new Error('Invalid Account');
                }
                else if(account.accountNumber !== transaction.accountNumber){
                    throw new Error('Invalid Account');
                }
    
                transaction.token = await transaction.generateAuthToken();
                await transaction.save();
    
                res.json({
                    success: transaction.type+' sent successfully',
                    token: transaction.token
                })
            }catch(err){res.status(400).json({error: err.message})}
            
        }
    }

    static showAll() {
        return async (req,res) => {
            let transaction = await Transaction.find();
            if(!transaction) return res.status(404).json({message: 'No transactions available'});

            res.send(transaction);
        }
    }

    static index() {
        return async (req,res) => {
            let transaction = await Transaction.findById(req.params._id);
            if(!transaction) return res.status(404).json({message: 'No transactions available'});

            res.json({
                type: transaction.type,
                account_name: transaction.accountName,
                amount: transaction.amount
            });
        }
    }
}
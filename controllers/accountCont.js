const { Account } = require('../model/Account');
const { User } = require('../model/User');
const _ = require('lodash');
const randomize = require('randomatic');

module.exports = class {
    static create() {
        return async (req,res) => {
            try{
                let account = await Account.findOne({accountNumber: req.body.accountNumber});
                if(account) res.status(422).json({message: 'Account is owned'});
    
                account = new Account(_.pick(req.body,['ID']));
                let user = await User.findById(req.params._id);
                if(!user) return res.status(404).json({message: 'User not found'})
                account.accountName = await account.setAccountName(user._id, account.accountName);
                account.accountNumber = await account.setAccountNumber();
                await account.save();
    
                res.json({
                    success: 'Account Created Successfully',
                    accountName: account.accountName,
                    accountNumber: account.accountNumber,
                    balance: account.balance,
                    type: account.type
                });
            }catch(ex){res.status(400).json({message: ex.message})}
            
        }
    }
}


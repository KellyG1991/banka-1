const { Deposit } = require('../../model/Transactions/Deposit');
const { Account } = require('../../model/Account');
const _ = require('lodash');


module.exports = class {
    static deposit() {
        return async (req,res) => {
            try{
                let account = await Account.findById(req.params._id);
                let deposit = new Deposit(_.pick(req.body,['accountName', 'accountNumber', 'amount', 'depositedBy']))
                
                if(account.accountName !== deposit.accountName){
                    throw new Error('Invalid Account');
                }
                else if(account.accountNumber !== deposit.accountNumber){
                    throw new Error('Invalid Account');
                }
    
                deposit.token = await deposit.generateAuthToken();
                await deposit.save();
    
                res.json({
                    success: 'Deposit Request Sent',
                    token: deposit.token
                })
            }catch(err){res.status(400).json({error: err.message})}
            
        }
    }
}
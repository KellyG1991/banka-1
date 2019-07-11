const {User} = require('../model/User');
const _ = require('lodash');


module.exports = class {
    static signup() {
        return async (req,res) => {
            try{
                let user = await User.findOne({email: req.body.email});
                if(user) return res.status(422).json({message: 'User already exists'});
    
                user = new User(_.pick(req.body,['type','firstName', 'lastName', 'email', 'password', 'DOB']));
                user.isAdmin = true;
                user.password = await user.hashPassword(user.password);
                user.token = await user.generateAuthToken();

                await user.save();

                res.json({
                    success: 'Admin created successfully',
                    user_id: user._id
                });
            }catch(err){res.status(400).json({error: err.message})}
            
        }
    }
}
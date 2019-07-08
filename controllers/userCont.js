const {User} = require('../model/User');
const _ = require('lodash');

module.exports = class {
    static signup() {
        return async (req,res) => {
            try{
                let user = await User.findOne({email: req.body.email});
                if(user) return res.status(422).json({message: 'User already exists'});
    
                user = new User(_.pick(req.body,['firstName', 'lastName', 'email', 'password', 'DOB']));
                user.password = await user.hashPassword(user.password);

                await user.save();
    
                res.json({
                    success: 'User created successfully',
                    id: user._id
                });
            }catch(err){res.status(400).json({error: err.message})}
            
        }
    }

    static login() {
        return async (req,res) => {
            try{
                let user = await User.validCredentials(req.body.email, req.body.password);
                user.token = await user.generateAuthToken();

                await user.save();

                res.json({
                    success: 'Successful Login',
                    token: user.token
                })
            }catch(err){res.status(400).json({error: err.message})}
        }
    }

    static show() {
        return async(req,res) => {
            try{
                let user = await User.find();
                if(!user) return res.status(404).json({message: 'No users available'});

                res.send(user);
            }catch(ex){res.status(400).json({error: err.message})}
        }
    }
}
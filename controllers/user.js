const { User } = require('../model/User');
const _ = require('lodash');

// create a user
module.exports = class {
    static post() {
        return async (req,res) => {
            // we check if user already exists through the unique ID
            let user = await User.findOne({ID: req.body.ID});
            if(user) return res.status(400).send('User already exists');

            // Create User
            user = new User(_.pick(req.body,['ID','email','firstName','lastName','password']));
            await user.save();

            return res.status(201).json({
                message: 'User Created Successfully',
                User_id: user._id
            })
        }
    }
}





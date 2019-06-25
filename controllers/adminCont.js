const config = require('config');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/Admin');
const bcrypt = require('bcrypt');
const _ = require('lodash');


module.exports = class {
    static createAdmin(){
        return async (req,res) => {
            try{
                let admin = await Admin.findOne({ID: req.body.ID});
                if(admin) return res.status(422).json({message: 'Admin already exists'});
                
                admin = new Admin(_.pick(req.body,['ID','email','firstName','lastName','password','type']));
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
                await admin.save();
    
                // generate token
                const token = jwt.sign({_id: admin._id}, config.get('jwtAdmin'), {expiresIn: '1h'});
                res.header('x-admin-token',token).json({message: 'Admin created successfully', token: token});
            }catch(err){res.send(err.message)}
            
        }
    }
}
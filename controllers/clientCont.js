const {Client} = require('../model/Client');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = class {
    static createClient() {
        return async (req,res) => {
            try{
                let client = await Client.findOne({ID: req.body.ID});
                if(client) return res.status(422).json({message: 'Client created Successfully'});

                client = new Client(_.pick(req.body, ['ID', 'email', 'firstName', 'lastName','password']));
                const salt = await bcrypt.genSalt(10);
                client.password = await bcrypt.hash(client.password, salt);
                await client.save();

                // generate token
                const token = jwt.sign({_id: client._id}, config.get('jwtClient'));
                res.header('x-client-token', token).json({message: 'Client Created successfully'});
            }catch(err){res.send(err.message)}
        }
    }
}
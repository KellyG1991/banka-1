const {Client} = require('../model/Client');
const {Account} = require('../model/Account');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Fawn = require('fawn');
const mongoose = require('mongoose');

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

    // get all clients
    static showClients() {
        return async (req,res) => {
            let client = await Client.find();
            if(!client) return res.status(404).json({message: 'No clients found'});

            res.send(client);
        }
    }
    //get specific clients
    static indexClient() {
        return async (req,res) => {
            let client = await Client.findById(req.params._id);
            if(!client) return res.status(404).json({message: 'Client not found'});

            res.send(_.pick(client, ['ID','firstName','lastName']));
        }
    }
    
    // delete client
    static deleteClient() {
        return async (req,res) => {
            let client = await Client.findByIdAndDelete(req.params._id);
            if(!client) return res.status(404).json({message: 'Client not found'});

            await client.save();
            res.json({message: 'Client deleted successfully'});
        }
    }

    static loginRequest() {
        return async (req,res) => {
            let client = await Client.findOne({email: req.body.email});
            if(!client) return res.status(422).json({message: 'Invalid email or password'});
        
            // check password is valid
            let validPassword = await bcrypt.compare(req.body.password, client.password);
            if(!validPassword) return res.status(422).json({message: 'Invalid email or password'});
            await client.save();

            const lgToken = jwt.sign({email: client.email}, config.get('jwtClient'));
            res.header('x-login-token', lgToken).json({message: 'Login Successful'});
        }
    }

    static accountCreate() {
        return async (req,res) => {
            // Account structure
            let account = await Account.findOne({accountNumber: req.body.accountNumber});
            if(account) return res.status(400).json({message: 'Account already exists'});

            account = new Account(_.pick(req.body, ['client','accountNumber','owner','type']));
            if(account.balance > 0){
                account.status = 'active'
            }else{account.status = 'dormant'}
            account.client = req.client._id;

            Fawn.init(mongoose);

            const task = Fawn.Task();

            await task.save(Account.collection.collectionName, account)
                .update(Client.collection.collectionName, {_id: req.client._id}, {$push: {Account: account._id}})
                .run();
            
            return res.status(201).json({
                message: 'Account Created Successfully',
                account_id: account._id
            })
        }
    }

}
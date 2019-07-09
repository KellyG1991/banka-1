const mongoose = require('mongoose');
const Joi = require('joi');
const { Account } = require('../Account');
const jwt = require('jsonwebtoken');
const config = require('config');


const depositSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    depositedBy: {
        type: String,
        required: true
    },
    token: {type: String}
},{timestamps: {createdAt:'created_at'}, autoCreate: false});


// generate token
depositSchema.methods.generateAuthToken = async () => {
   
    const token = await jwt.sign({_id: this._id}, config.get('jwtKey'),{expiresIn: "24hr"});
    this.token = token;
 
    return token; 
 }

 // Joi validation
 exports.validDeposit = function(req,res,next) {
     const details = req.body;

     const schema = {
         accountName: Joi.string().required(),
         accountNumber : Joi.number().required(),
         amount: Joi.number().required(),
         depositedBy: Joi.string().required()
     }

     const options = config.get('joiOptions');
     
     const { error } = Joi.validate(details, schema, options);
     if(error) return res.status(422).json({error: error.details[0].message});

     next();
 }

//model
exports.Deposit = mongoose.model('Deposit', depositSchema);
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Deposit', 'Withdrawal']
    },
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
        type: String
    },
    token: {type: String}
},{timestamps: {createdAt:'created_at'}, autoCreate: false});


// generate token
transactionSchema.methods.generateAuthToken = async () => {
   
    const token = await jwt.sign({_id: this._id}, config.get('jwtKey'),{expiresIn: "24hr"});
    this.token = token;
 
    return token; 
 }

 // Joi validation
 exports.validTransaction = function(req,res,next) {
     const details = req.body;

     const schema = {
         type: Joi.string().valid('Deposit', 'Withdrawal').required(),
         accountName: Joi.string().required(),
         accountNumber : Joi.number().required(),
         amount: Joi.number().required()
     }

     const options = config.get('joiOptions');
     
     const { error } = Joi.validate(details, schema, options);
     if(error) return res.status(422).json({error: error.details[0].message});

     next();
 }

//model
exports.Transaction = mongoose.model('Transaction', transactionSchema);
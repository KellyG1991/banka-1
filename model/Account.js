const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const _ = require('lodash');


const accountSchema = new mongoose.Schema({
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'Client'
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    owner: {
        type: Number,
        required: true  // has to be the same as the id as the client
    },
    type: {
        type: String,
        enum: ['saving', 'current']
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'dormant'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now
    }

})

exports.Account = mongoose.model('Account', accountSchema);

exports.accountRegister = function(req,res,next){
    const details = req.body;

    const schema = {
        accountNumber: Joi.number().required(),
        owner: Joi.number().required(),
        type: Joi.string().valid('saving', 'current').required(),
        status: Joi.string().valid('draft','active','dormant').required(),
        balance: Joi.number()
    }
    const options = config.get('joiOptions');
    
    const {error} = Joi.validate(details, schema, options);
    if(error) return res.status(422).send(error.details);

    next();
}
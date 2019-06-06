const mongoose = require('mongoose');
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

// General Schema
const accountSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    Address: {
        type: String,
        unique: true,
        required: true
    },
    Phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        unique: true,
        required: true,
    },
    Email: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    AccountType: {
        type: String
    }
});

// model 
const Account = mongoose.model('Account', accountSchema);

// validate function for schema
function validateAccount(acc){
    const schema = {
        ID: Joi.number().min(5).required(),
        Address: Joi.string().min(10).max(15).required(),
        Phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).required(),
        Email: Joi.string().min(10).max(100).required().email(),
        Name: Joi.string().min(8).max(100).required(),
        DOB: Joi.date().format('YYY-MM-DD').required(),
        AccountType: Joi.string().required()
    }
    return Joi.validate(acc,schema);
}


exports.Account = Account;
exports.validate = validateAccount;
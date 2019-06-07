const mongoose = require('mongoose');
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

// Schema
const depositSchema = new mongoose.Schema({
    Account_Name: {
        type: String,
        required: true
    },
    Account_Number: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        minlength: 4,
        maxlength: 7,
        required: true
    },
    Date: {
        type: Date,
        required: true,
    }
});

// model
const Deposit = mongoose.model('Deposit', depositSchema);

//  validating function
function validatingDepo(depo){
    const schema = {
        Account_Name: Joi.string().required(),
        Account_Number: Joi.string().required(),
        Amount: Joi.number().min(4).required(),
        Date: Joi.date().format('DD-MM-YYY').required()
    }
    return Joi.validate(depo,schema);
}




exports.Deposit = Deposit;
exports.validating = validatingDepo;
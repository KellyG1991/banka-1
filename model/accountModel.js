const mongoose = require('mongoose');
const Joi = require('joi');

// General Schema
const accountSchema = new mongoose.Schema({
    ID: {
        type: Number,
        minlength: 5,
        required: true,
        unique: true
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
    }
})


// subdocument
const AccountType = Account.discriminator('AccountType', new Schema({
    Savings: String,
    Current: String,
    Credit: String
}));

// model 
const Account = mongoose.model('Account', accountSchema)
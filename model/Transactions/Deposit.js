const mongoose = require('mongoose');
const Joi = require('joi');
const Account = require('../Account');


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
    }
},{timestamps: {createdAt:'created_at'}, autoCreate: false});


// Account Name and account number has to be from the same account
depositSchema.methods.validAccount = async () => {
    
}

//model
exports.Deposit = mongoose.model('Deposit', depositSchema);
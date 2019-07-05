const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const {User} = require('./User');

const accountSchema = new mongoose.Schema({
    ID: {
        type: Number,
        unique: true,
        required: true
    },
    accountName: {
        type: String
    },
    accountNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Dormant'],
        default: 'Draft'
    },
    type: {
        type: String,
        enum: ['Savings', 'Current'],
        default: 'Current'
    },
    balance: {
        type: Number,
        default: 0
    }
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, autoCreate:false}
)

// set the accountName to match the users first and last name
accountSchema.methods.setAccountName = async (_id, accName) => {
    
    let user = await User.findOne({ _id });
    this.accountName = accName;
    this.accountName = await user.firstName +" "+ user.lastName;

    return this.accountName;
}

exports.validAccount = async (req,res, next) => {
    const details = req.body;

    const schema = {
        ID: Joi.number().required(),
        accountNumber: Joi.number().required()
    }

    const options = config.get('joiOptions');

    const {error} = Joi.validate(details, schema, options);
    if(error) return res.status(422).json({error: error.details[0].message});

    next();
}



//model
exports.Account = mongoose.model('Account', accountSchema)
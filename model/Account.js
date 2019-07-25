const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('./User');
const randomize = require('randomatic');

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
    },
    token: {type: String}
    
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, autoCreate:false}
)

// set the accountName to match the users first and last name
accountSchema.methods.setAccountName = async (_id, accName) => {
    
    let user = await User.findOne({ _id });
    this.accountName = accName;
    this.accountName = await user.firstName.toUpperCase() +" "+ user.lastName.toUpperCase();

    return this.accountName;
}

// set the account number 
accountSchema.methods.setAccountNumber = () => {
    let randomizer = randomize('0', 15);
    this.accountName = randomizer;

    return this.accountName;
}


// generate token
accountSchema.methods.generateAuthToken = async () => {
   
    const token = await jwt.sign({_id: this._id}, config.get('jwtKey'), {expiresIn: '365d'});
    this.token = token;
 
    return token; 
 }
 
 

exports.validAccount = async (req,res, next) => {
    const details = req.body;

    const schema = {
        ID: Joi.number().required(),
        type: Joi.string().valid('Savings', 'Current')
    }

    const options = config.get('joiOptions');

    const {error} = Joi.validate(details, schema, options);
    if(error) return res.status(422).json({error: error.details[0].message});

    next();
}



//model
exports.Account = mongoose.model('Account', accountSchema)
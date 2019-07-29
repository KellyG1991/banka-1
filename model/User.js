const mongoose = require('mongoose');
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['Staff', 'Client'],
        default: 'Client'
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {type: String},
    DOB: {
        type: Date,
        required: true,
    },
    position: String,
    isAdmin: Boolean
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}, autoCreate: false}
);

// password hashing
userSchema.methods.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    this.password = password;
    this.password = await bcrypt.hash(this.password, salt);

    return this.password;
}
// generate token
userSchema.methods.generateAuthToken = async () => {
   
   const token = await jwt.sign({_id: this._id}, config.get('jwtKey'), {expiresIn: "365d"});
   this.token = token;

   return token; 
}

// renew token
userSchema.methods.renewToken = async () => {
    let user = await this.User.validCredentials(this.email, this.password);
    this.token = await user.generateAuthToken();

    return this.token;
}

// user credentials
userSchema.statics.validCredentials = async (email, password) => {
    let user = await exports.User.findOne({ email });
    if(!user) throw new Error('Invalid email or password');

    let validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) throw new Error('Invalid email or password');

    return user;
}

// validate User
exports.validateUser = async (req,res,next) => {
    const details = req.body;

    const schema = {
        type: Joi.string().valid('Client', 'Staff'),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        DOB: Joi.date().format('YYY-MM-DD').required(),
        position: Joi.string(),
        isAdmin: Joi.boolean()
    }

    const options = config.get('joiOptions');

    const { error } = Joi.validate(details, schema, options);
    if(error) return res.status(422).json({Error: error.details[0].message});

    next();
}


exports.User = mongoose.model('User', userSchema);
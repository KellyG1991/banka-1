const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongooseHidden = require('mongoose-hidden')({defaultHidden: {password: true}})
const { isValidEmail } = require('../helpers/validEmail');
const config = require('config');
const Auth = require('../services/auth');

exports.schema = new mongoose.Schema({
    ID: {
        type: Number
        , unique: true
        , required: true
    },
    email: {
        type: String, 
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        hideJson: true,
        hideJson: true,
    },
    type: {
        type: String,
        enum: ['client','staff', 'admin'],
        default: 'client',
        hideJson: true,
        hideObject: true
    }
})

exports.schema.plugin(mongooseHidden);

// user model
exports.User = mongoose.model('User', exports.schema);

// Verify password
exports.schema.methods.verifyPassword = async function(password){
    const verified = await bcrypt.compare(password, this.password);

    return Boolean(verified);
}

// generate authentication token
exports.schema.methods.generateToken = function(claims = {}){
    let payload = {
        jwtid: this._id.toHexString(),
        subject: this.email,
        ...claims
    }
    return Auth.generateToken(payload);
};

// Validate login
exports.validLogin = function (req,res,next) {
    let { body } = req;
    let schema;

    if(isValidEmail(body.username)){
        schema = Joi.object().keys({
            username: Joi.string().email().required(),
            code: Joi.string().regex(/^\d{4}$/).required()
        });

        req.username = 'email';
    }
    
    const options = config.get('joiOptions');

    const { error } = Joi.validate(body, schema, options);
    if(error) return res.status(422).send(error.details);

    next();

}

// validate login request
exports.validLoginRequest = function (req,res,next) {
    let { body } = req;
    let schema;

    if(isValidEmail(body.username)){
        schema = Joi.object().keys({
            username: Joi.string().email().required(),
        });

        req.username = 'email';
    }
    
    const options = config.get('joiOptions');

    const { error } = Joi.validate(body, schema, options);
    if(error) return res.status(422).send(error.details);

    next();

}

// validate code
exports.validateCode = function(req,res,next){
    let { body } = req;

    const schema = {code: Joi.string().regex(/^\d{4}$/).required()};

    const options = config.get('joiOptions');

    const { error } = Joi.validate(body, schema, options);
    if(error) return res.status(422).send(error.detail);

    next();
        
}

// validate user registration
exports.validRegister = function(req,res,next){
    const details = req.body;

    const schema = {
        ID: Joi.number().required(),
        email: Joi.string().email().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        password: Joi.string().required()
    }

    const options = config.get('joiOptions');

    const { error } = Joi.validate(details, schema, options);
    if(error) return res.status(422).send(error.details);

    next();
}


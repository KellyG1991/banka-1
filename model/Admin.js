const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

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
        type: String
    },
    type: {
        type: String,
        default: 'Admin'
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    , autoCreate: false
})

// user model
exports.Admin = mongoose.model('Admin', exports.schema);

// validate user registration
exports.adminRegister = function(req,res,next){
    const details = req.body;

    const schema = {
        ID: Joi.number().required(),
        email: Joi.string().email().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        password: Joi.string().required(),
    }

    const options = config.get('joiOptions');

    const { error } = Joi.validate(details, schema, options);
    if(error) return res.status(422).send(error.details);

    next();
}


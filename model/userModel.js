const mongoose = require('mongoose');
const Joi = require('joi');

// Create a user Schema model
const User = mongoose.model('User', mongoose.Schema({
    username: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    }
}));

// User joi validator
function userValidator(user){
    const schema = {
        username: Joi.string().min(8).max(100).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).max(100).required()
    }
    return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = userValidator;


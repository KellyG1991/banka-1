const mongoose = require('mongoose');
const Joi = require('joi');

// admin schema
const adminSchema = new mongoose.Schema({
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
    },
    isAdmin: Boolean
});

const Admin = mongoose.model('Admin',adminSchema);

// User joi validator
function adminValidator(user){
    const schema = {
        username: Joi.string().min(8).max(100).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).max(100).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user,schema);
}

exports.Admin = Admin;
exports.validate = adminValidator;
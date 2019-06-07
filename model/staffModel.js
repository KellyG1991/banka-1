const mongoose = require('mongoose');
const Joi = require('joi');

// admin schema
const staffSchema = new mongoose.Schema({
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
    position: {
        type: String,
        required: true
    },
    isStaff: Boolean
});

const Staff = mongoose.model('Staff',staffSchema);

// User joi validator
function staffValidator(staff){
    const schema = {
        username: Joi.string().min(8).max(100).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).max(100).required(),
        position: Joi.string().required(),
        isStaff: Joi.boolean()
    }
    return Joi.validate(staff,schema);
}

exports.Staff = Staff;
exports.validate = staffValidator;